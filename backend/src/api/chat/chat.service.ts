import { PrismaService } from "@/lib/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";


@Injectable()
export class ChatService {
    constructor(
        private prisma: PrismaService 
    ) {}

    async getAllChats(limitStr?: string, lastId?: string, search?: string) {
        let query: Prisma.ChatFindManyArgs = {};
        const limit = limitStr ? Number(limitStr) : 10;
        if (lastId) {
            query = {
                ...query,
                cursor: {
                    id: lastId
                },
                skip: 1,
            }
        }
        if (search) {
            query = {
                ...query,
                where: {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
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
        const [chats, totalChat] = await this.prisma.$transaction([
            this.prisma.chat.findMany(query),
            this.prisma.chat.count(),
        ]);
        const totalPage = Math.ceil(totalChat / limit);
        const nextId = chats.length > 0 ? chats[chats.length - 1].id : null;
        return {
            chats,
            totalPage,
            totalChat,
            nextId
        }
    }
}