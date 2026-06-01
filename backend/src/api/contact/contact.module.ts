import { Module } from "@nestjs/common";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";


@Module({
    providers: [ContactService, AccessTokenStrategy],
    controllers: [ContactController],
})
export class ContactModule {}