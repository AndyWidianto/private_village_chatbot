import { Chat } from "@prisma/client";



export interface CacheChat extends Chat {
    expired: Date
}

export const CHAT_RAM_CACHE: Record<string, CacheChat> = {};