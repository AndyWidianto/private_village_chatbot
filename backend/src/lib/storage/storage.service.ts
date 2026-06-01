import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import fs from "fs/promises";
import path from "path";
import * as mime from "mime-types";

@Injectable()
export class StorageService {
    private readonly storageDir = path.join(process.cwd(), "public/document");

    constructor() { }

    async saveDocument(file: Express.Multer.File) {
        try {
            await fs.mkdir(this.storageDir, { recursive: true });
            const fileExt = path.extname(file.originalname);
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileName = `${uniqueSuffix}${fileExt}`;
            const fullPath = path.join(this.storageDir, fileName);
            await fs.writeFile(fullPath, file.buffer);
            return {
                fileName: fileName,
                relativePath: `/public/document/${fileName}`,
            };
        } catch (error: any) {
            throw new InternalServerErrorException(
                `Gagal menyimpan dokumen: ${error.message}`
            );
        }
    }

    async saveBase64Media(base64String: string, mimetype: string) {
        try {
            await fs.mkdir(this.storageDir, { recursive: true });
            const cleanBase64 = base64String.replace(/^data:[a-zA-Z0-9\/\.\-]+;base64,/, "");
            const mimeToExt: Record<string, string> = {
                'image/png': '.png',
                'image/jpeg': '.jpg',
                'image/jpg': '.jpg',
                'image/webp': '.webp',
                'video/mp4': '.mp4',
                'audio/mpeg': '.mp3',
                'audio/ogg': '.ogg',
                'application/pdf': '.pdf'
            };
            const fileExt = mimeToExt[mimetype] || '.bin';
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileName = `${uniqueSuffix}${fileExt}`;
            const fullPath = path.join(this.storageDir, fileName);
            await fs.writeFile(fullPath, cleanBase64, 'base64');

            return {
                fileName: fileName,
                relativePath: `/public/document/${fileName}`,
            };
        } catch (error: any) {
            throw new InternalServerErrorException(
                `Gagal menyimpan media WhatsApp: ${error.message}`
            );
        }
    }

    async deleteDocument(fileName: string) {
        const fullPath = path.join(this.storageDir, fileName);

        try {
            await fs.access(fullPath);
            await fs.unlink(fullPath);

            return {
                success: true,
                message: "Dokumen berhasil dihapus dari sistem",
            };
        } catch (error: any) {
            if (error.code === "ENOENT") {
                throw new NotFoundException("Dokumen tidak ditemukan di penyimpanan lokal");
            }
            throw new InternalServerErrorException(
                `Gagal menghapus dokumen: ${error.message}`
            );
        }
    }

    async readFile(fileName: string) {
        const filePath = path.join(this.storageDir, fileName);
        try {
            await fs.access(filePath);
        } catch (error) {
            throw new NotFoundException(`File dengan nama "${fileName}" tidak ditemukan.`);
        }

        try {
            const fileBuffer = await fs.readFile(filePath);
            const mimeType = mime.lookup(filePath) || "application/octet-stream";
            const mediaType = mimeType.split("/")[0];
            const mediaBase64 = fileBuffer.toString("base64");
            return {
                fileName,
                mimeType,
                mediaType,
                mediaBase64,
            };
        } catch (error: any) {
            console.error("Gagal membaca file:", error.message);
            throw new InternalServerErrorException("Terjadi kesalahan saat memproses file.");
        }
    }

    async parseMulterFile(file: Express.Multer.File) {
        if (!file || !file.buffer) {
            throw new BadRequestException("File tidak valid atau tidak ditemukan.");
        }

        try {
            const fileName = file.originalname;
            const mimeType = file.mimetype || "application/octet-stream";
            let mediaType = mimeType.split("/")[0];
            if (mediaType === 'application' || mediaType === 'text') {
                mediaType = 'document';
            }
            const mediaBase64 = file.buffer.toString("base64");

            return {
                fileName,
                mimeType,
                mediaType, // Menghasilkan: 'image', 'video', 'audio', atau 'document'
                mediaBase64,
            };

        } catch (error: any) {
            console.error("Gagal memproses file Multer:", error.message);
            throw new InternalServerErrorException("Terjadi kesalahan saat memproses file.");
        }
    }

    async saveBase64ToFile(base64Data: string, mimetype: string, fileName: string) {
        let extension = 'bin';
        if (mimetype.includes('jpeg') || mimetype.includes('jpg')) extension = 'jpg';
        else if (mimetype.includes('png')) extension = 'png';
        else if (mimetype.includes('ogg') || mimetype.includes('audio')) extension = 'ogg';
        else if (mimetype.includes('pdf')) extension = 'pdf';
        else if (mimetype.includes('mp4')) extension = 'mp4';

        const fullFileName = `${fileName}.${extension}`;
        const fullPath = path.join(this.storageDir, fullFileName);

        try {
            await fs.mkdir(this.storageDir, { recursive: true });
            const cleanBase64 = base64Data.replace(/^data:.+;base64,/, '');
            const fileBuffer = Buffer.from(cleanBase64, 'base64');
            await fs.writeFile(fullPath, fileBuffer);

            return {
                success: true,
                message: "File berhasil dikonversi dan disimpan ke sistem",
                data: {
                    fileName: fullFileName,
                    filePath: fullPath,
                    mimetype: mimetype
                }
            };
        } catch (error: any) {
            throw new InternalServerErrorException(
                `Gagal memproses dan menyimpan file biner: ${error.message}`
            );
        }
    }
}