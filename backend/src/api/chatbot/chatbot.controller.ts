import { Body, Controller, Delete, Get, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ChatbotService } from "./chatbot.service";
import { AuthGuard } from "@nestjs/passport";
import type { RequestAndPayload } from "@/lib/types";



@Controller("api")
export class ChatbotController {

    constructor(private service: ChatbotService) { }

    @UseGuards(AuthGuard("jwt"))
    @Post("chatbot")
    async Chatbot(@Req() req: RequestAndPayload, @Body() body: { id: string, message: string }) {
        const user = req.user;
        return this.service.RoomChat(user, body.id, body.message);
    }

    // @Get("model-ai")
    // async Model() {
    //     try {
    //         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    //         const data = await response.json();

    //         console.log("Daftar Model Tersedia:");
    //         data.models.forEach(m => {
    //             console.log(`- Nama: ${m.name}`);
    //             console.log(`  Kemampuan: ${m.supportedGenerationMethods.join(", ")}`);
    //         });
    //         return data;
    //     } catch (error) {
    //         console.error("Gagal ambil list model:", error);
    //     }
    // }
}