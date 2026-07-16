import { Controller, Post, Body, Get, Put, Param, Delete, Logger, Query } from "@nestjs/common";
import { CreateBookRecordDto, QueryBookRecordDto, UpdateBookRecordDto } from "../dto/book.dto";
import { BookkeepingService } from "../service/bookkeeping.service";

@Controller('bookkeeping/record')
export class RecordController {
    private readonly logger = new Logger(RecordController.name);

    constructor(private readonly bookkeepingService: BookkeepingService) {}

    @Post()
    public async createRecord(@Body() dto: CreateBookRecordDto) {
        const data = await this.bookkeepingService.CreateBookRecord(dto);
        return data
    }

    @Get()
    public async getRecordList(@Query() dto: QueryBookRecordDto) {
        const data = await this.bookkeepingService.QueryBookRecord(dto);
        return data
    }

    @Put(':id')
    public async updateRecord(@Param('id') id: number, @Body() dto: UpdateBookRecordDto) {
        const data = await this.bookkeepingService.UpdateBookRecord(id, dto);
        return data
    }

    @Delete(':id')
    public async deleteRecord(@Param('id') id: number) {
        const data = await this.bookkeepingService.RemoveBookRecord(id);
        return data
    }
}