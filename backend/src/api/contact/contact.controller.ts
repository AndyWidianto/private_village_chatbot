import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ContactService } from "./contact.service";




@Controller("api/contacts")
export class ContactController {
    constructor(private service: ContactService) {}

    @Get()
    // @UseGuards(AuthGuard("jwt"))
    async getAll(@Query() query: { search?: string, limit?: string, lastId?: string }) {
        console.log("Query: ", query);
        return this.service.getAll(query.limit, query.lastId, query.search);
    }
}