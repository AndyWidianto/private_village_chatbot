import { PrismaService } from "@/lib/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";


@Injectable()
export class ContactService {
    constructor(
        private prisma: PrismaService 
    ) {}

    async getAll(limitStr?: string, lastId?: string, search?: string) {
        let query: Prisma.ContactFindManyArgs = {};
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
        const [contacts, totalContact] = await this.prisma.$transaction([
            this.prisma.contact.findMany(query),
            this.prisma.contact.count({
                where: query.where
            }),
        ]);
        const totalPage = Math.ceil(totalContact / limit);
        const nextId = contacts.length > 0 ? contacts[contacts.length - 1].id : null;
        return {
            contacts,
            totalPage,
            totalContact,
            nextId
        }
    }
}