import { EvolutionService } from '@/lib/evolutions/evolutions.service';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { StorageService } from '@/lib/storage/storage.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BroadcastScheduleService {
  private readonly logger = new Logger(BroadcastScheduleService.name);

  constructor(
    private prisma: PrismaService,
    private evolution: EvolutionService,
    private storage: StorageService
  ) { }
  @Cron(CronExpression.EVERY_HOUR)
  handleHourlyCheck() {
    this.logger.log('Mengecek status broadcast yang dijadwalkan...');
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleBroadcasts() {
    this.logger.debug('Memeriksa antrean broadcast gagal untuk dikirim ulang...');
    try {
      const now = new Date();
      const thrtyMinuteAgo = new Date(now.getTime() - 30 * 60 * 1000);
      const broadcasts = await this.prisma.broadcast.findMany({
        where: {
          OR: [
            {
              scheduledAt: {
                gte: thrtyMinuteAgo,
                lte: now,
              },
              status: "PENDING"
            },
            {
              scheduledAt: null,
              status: "PENDING"
            }
          ]
        },
        include: {
          recipients: true
        }
      });
      for (const item of broadcasts) {
        let stats = {
          total: item.recipients,
          totalSent: 0,
          totalPending: item.recipients.filter(r => r.status === "PENDING").length,
          totalFailed: 0,
        }
        const sentIds: string[] = [];
        const [instance, _update] = await this.prisma.$transaction([
          this.prisma.device.findFirst({
            where: { id: item.instanceId }
          }),
          this.prisma.broadcast.update({
            where: { id: item.id },
            data: { status: "PROCESSING" }
          })
        ]);
        if (instance) {
          for (const recipient of item.recipients) {
            await this.randomSleep(10, 20);
            try {
              if (item.mediaUrl) {
                const readFile = await this.storage.readFile(item.mediaUrl);
                await this.evolution.sendMedia(instance?.instanceName, recipient.phoneNumber, readFile.mimeType, readFile.mediaType, readFile.fileName, readFile.mediaBase64, item.content);
                stats.totalSent += 1;
                stats.totalPending -= 1;
                sentIds.push(recipient.id);
              } else {
                await this.evolution.sendTextMessage(instance?.instanceName, recipient.phoneNumber, item.content);
                stats.totalSent += 1;
                stats.totalPending -= 1;
                sentIds.push(recipient.id);
              }
            } catch (err: any) {
              console.log("Terjadi error: ", err);
              stats.totalFailed += 1;
              stats.totalPending -= 1;
              await this.prisma.broadcastRecipient.update({
                where: { id: recipient.id },
                data: { status: "FAILED", errorMessage: err.message || "Internal server Error" }
              })
            }


            if ((stats.totalSent + stats.totalFailed) === 10 || (stats.totalSent + stats.totalFailed) >= item.recipients.length) {
              await this.prisma.$transaction([
                this.prisma.broadcastRecipient.updateMany({
                  where: { id: { in: sentIds } },
                  data: { status: "SENT" }
                })
              ])
            }
          }
        }
        await this.prisma.broadcast.update({
          where: {
            id: item.id
          },
          data: {
            status: "COMPLETED"
          }
        })
      }
    } catch (err) {
      console.error("Terjadi Error: ", err);
    }
  }

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async randomSleep(minMinutes: number, maxMinutes: number) {
    const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
    const ms = randomMinutes * 1000;
    console.log(`Menunggu secara acak selama ${randomMinutes} menit (${ms} ms)...`);
    await this.sleep(ms);
  }
}