import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import type { MessageTypeBroadcast, TypeRecipient } from '../types';

export const MessageTypeBroadcastArray: MessageTypeBroadcast[] = ["text", "image", "document"];


export class CreateBroadcastDto {
    @IsNotEmpty({ message: "Nama campaign broadcast tidak boleh kosong" })
    @IsString({ message: "Nama campaign harus berupa teks" })
    name: string;

    @IsEnum(MessageTypeBroadcastArray, { 
        message: "Tipe pesan harus berupa salah satu dari: text, image, atau document" 
    })
    messageType: MessageTypeBroadcast = "text";

    @IsNotEmpty({ message: "Content wajib terisi" })
    content: string;

    @IsNotEmpty({ message: "typeRecipient is not allowed null" })
    typeRecipient: TypeRecipient;

    @IsOptional()
    recipients: string[];

    @IsOptional()
    scheduledAt: Date;
}

export class UpdateBroadcastDto extends PartialType(CreateBroadcastDto) {}

