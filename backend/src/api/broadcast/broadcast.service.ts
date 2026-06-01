import { PrismaService } from "@/lib/prisma/prisma.service";
import { StorageService } from "@/lib/storage/storage.service";
import { CreateBroadcast, UpdateBroadcast } from "@/lib/types";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";



@Injectable()
export class BroadcastService {
    constructor(
        private prisma: PrismaService,
        private storage: StorageService
    ) { }

    async create(instanceId: string, data: CreateBroadcast) {
        const exisiting = await this.prisma.device.findFirst({
            where: { id: instanceId }
        });
        if (!exisiting) {
            throw new NotFoundException("Instance not found");
        }
        let recipients: { phoneNumber: string }[] = [];

        if (data.recipients) {
            recipients = [...recipients, ...data.recipients.map(r => ({
                phoneNumber: r,
            }))]
        }

        if (data.typeRecipient === "all" || data.typeRecipient === "group") {
            let queryContact: Prisma.ContactFindManyArgs = {};
            if (data.typeRecipient === "group") {
                queryContact = {
                    where: {
                        isGroup: true
                    }
                }
            }
            const contacts = await this.prisma.contact.findMany(queryContact);
            recipients = [...recipients, ...contacts.map(c => ({ phoneNumber: c.number }))];
        }

        if (data.excelFile) {
            try {
                const workbook = XLSX.read(data.excelFile.buffer, { type: 'buffer' });
                if (workbook.SheetNames.length > 0) {
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const rawData = XLSX.utils.sheet_to_json(worksheet);
                    recipients = [...recipients, ...rawData.map((row: any) => ({
                        phoneNumber: row['No HP'] || row['Phone'] || row['Phone Number'] || row['Nomor'] || ''
                    }))]
                }
            } catch (error) {
                console.error("Gagal memproses file Excel:", error);
            }
        }
        let mediaUrl: string | null = null;
        if (data.file) {
            const document = await this.storage.saveDocument(data.file);
            mediaUrl = document.fileName;
        }
        const dataToSave = {
            name: data.name,
            content: data.content,
            instanceId: instanceId,
            messageType: data.messageType || "text",
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
            mediaUrl: mediaUrl,
        }
        const broadcast = await this.prisma.broadcast.create({
            data: {
                ...dataToSave,
                recipients: {
                    createMany: {
                        data: recipients
                    }
                }
            },
            include: {
                recipients: true
            }
        });
        return broadcast;
    }

    async getAll(lastId?: string, limitStr?: string, search?: string) {
        let query: Prisma.BroadcastFindManyArgs = {};
        const limit = limitStr ? Number(limitStr) : 10;
        if (lastId) {
            query = {
                ...query,
                cursor: {
                    id: lastId,
                },
                skip: 1,
            }
        }
        if (search) {
            query = {
                ...query,
                where: {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { content: { contains: search, mode: "insensitive" } }
                    ]
                }
            }
        }
        query = {
            ...query,
            take: limit,
            orderBy: {
                id: "desc"
            }
        }
        const [broadcasts, totalBroadcast] = await this.prisma.$transaction([
            this.prisma.broadcast.findMany({ ...query }),
            this.prisma.broadcast.count()
        ]);
        const broadcastIds = broadcasts.map(b => b.id);

        const recipientStats = await this.prisma.broadcastRecipient.groupBy({
            by: ['broadcastId', 'status'],
            _count: {
                id: true // Menghitung jumlah baris data
            },
            where: {
                broadcastId: { in: broadcastIds }
            }
        });

        const broadcastsParse =  broadcasts.map(broadcast => {
            // Cari data statistik yang cocok dengan ID broadcast ini
            const statsForThisBroadcast = recipientStats.filter(s => s.broadcastId === broadcast.id);

            // Ambil angka dari hasil grup, default 0 jika status tersebut belum ada datanya
            const totalPending = statsForThisBroadcast.find(s => s.status === 'PENDING')?._count.id || 0;
            const totalFailed = statsForThisBroadcast.find(s => s.status === 'FAILED')?._count.id || 0;
            const totalSent = statsForThisBroadcast.find(s => s.status === 'SENT')?._count.id || 0;

            return {
                ...broadcast,
                totalPending,
                totalFailed,
                totalSent,
                totalRecipients: totalPending + totalFailed + totalSent // Gabungan ketiganya adalah total seluruh penerima
            };
        });
        return {
            broadcasts: broadcastsParse,
            nextId: broadcastsParse.length > 0 ? broadcastsParse[broadcastsParse.length - 1].id : null,
            totalPage: Math.ceil(totalBroadcast / limit),
            totalBroadcast
        }
    }
    async update(id: string, data: UpdateBroadcast) {
        const existing = await this.prisma.broadcast.findFirst({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("Broadcast not found");
        }
    }
    async delete(id: string) {
        const existing = await this.prisma.broadcast.findFirst({
            where: { id }
        });
        if (!existing) {
            throw new NotFoundException("Broadcast not found");
        }
        if (existing.mediaUrl) {
            await this.storage.deleteDocument(existing.mediaUrl);
        }
        await this.prisma.broadcast.delete({
            where: { id }
        });
        return "Delete broadcast successfully";
    }
}


