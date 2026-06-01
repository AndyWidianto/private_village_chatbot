
export type MessageTypeBroadcast = "text" | "image" | "document";
export type TypeRecipient = "manual" | "all" | "group";

export interface CreateBroadcast {
    name: string;
    messageType: MessageTypeBroadcast;
    content: string;
    recipients: string[];
    typeRecipient: TypeRecipient;
    file?: Express.Multer.File;
    scheduledAt?: Date;
    excelFile?: Express.Multer.File;
}

export interface UpdateBroadcast extends Partial<CreateBroadcast> {}