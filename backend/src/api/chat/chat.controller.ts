import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { AuthGuard } from "@nestjs/passport";




@Controller("api/chats")
export class ChatController {
    constructor(private service: ChatService) {}

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async getAll(@Query() query: { search?: string, limit?: string, lastId?: string }) {
        return this.service.getAllChats(query.limit, query.lastId, query.search);
    }
}