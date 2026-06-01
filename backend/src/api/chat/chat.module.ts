import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";


@Module({
    providers: [ChatService, AccessTokenStrategy],
    controllers: [ChatController],
})
export class ChatModule {}