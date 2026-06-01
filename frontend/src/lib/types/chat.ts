

export interface Chat {
    id: string;
    name: string | null;
    updatedAt: string;
    instanceName: string;
    unreadCount: number;
    lastMessage: string | null;
    profileUrl?: string | null;
}

export interface Contact {
    number: string;
    id: string;
    remoteJid: string;
    deviceId: string;
    name: string | null;
    pushName: string | null;
    verifiedName: string | null;
    isGroup: boolean;
    profileUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}
