import { Module } from "@nestjs/common";
import { BroadcastScheduleService } from "./schedule.broadcast";
import { StorageService } from "@/lib/storage/storage.service";
import { EvolutionService } from "@/lib/evolutions/evolutions.service";

@Module({
    providers: [BroadcastScheduleService, StorageService, EvolutionService]
})
export class ScheduleModule {}