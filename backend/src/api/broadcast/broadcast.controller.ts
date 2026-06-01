import { CreateBroadcastDto } from "@/lib/dto/broadcast.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { BroadcastService } from "./broadcast.service";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";


@Controller("api/broadcasts")
export class BroadcastController {
    constructor(private service: BroadcastService) {}

    @Get()
    @UseGuards(AuthGuard("jwt"))
    async getAll(@Query() query: { lastId: string, limit: string, search: string }) {
        return await this.service.getAll(query.lastId, query.limit, query.search);
    }


    @Post(":instanceId")
    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(FileFieldsInterceptor([
        { name: "file", maxCount: 1 },
        { name: "excelFile", maxCount: 1 }
    ]))
    async create(@Param("instanceId") instanceId: string, 
    @Body() body: CreateBroadcastDto, 
    @UploadedFiles() files: { file?: Express.Multer.File[], excelFile?: Express.Multer.File[] }
    ) {
        const file = files.file?.[0];
        const excelFile = files.excelFile?.[0];
        return await this.service.create(instanceId, {...body, file, excelFile });
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async delete(@Param("id") id: string) {
        return await this.service.delete(id);
    }
    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    async update() {}
}