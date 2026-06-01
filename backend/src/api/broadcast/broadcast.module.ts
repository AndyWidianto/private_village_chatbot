import { Module } from "@nestjs/common";
import { BroadcastService } from "./broadcast.service";
import { BroadcastController } from "./broadcast.controller";
import { StorageService } from "@/lib/storage/storage.service";
import { AccessTokenStrategy } from "@/lib/guards/access.strategy";


@Module({
    providers: [BroadcastService, StorageService, AccessTokenStrategy],
    controllers: [BroadcastController],
})
export class BroadcastModule {}
