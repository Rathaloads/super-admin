import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto';
import { BookkeepingService } from '../service/bookkeeping.service';

@Controller('bookkeeping/book')
export class BookController {
    private readonly logger = new Logger(BookController.name);

    constructor(
        private readonly bookkeepingService: BookkeepingService
    ) {}

    @Post()
    public async createBook(@Body() dto: CreateBookDto) {
        const data = await this.bookkeepingService.CreateBook(dto);
        return data
    }

    @Get('all')
    public async getAllBook() {
        const data = await this.bookkeepingService.QueryAllBook();
        return data
    }

    @Put(':id')
    public async updateBook(@Param('id') id: number, @Body() dto: UpdateBookDto) {
        const data = await this.bookkeepingService.UpdateBook(id, dto);
        return data
    }

    @Delete(':id')
    public async deleteBook(@Param('id') id: number) {
        const data = await this.bookkeepingService.RemoveBook(id);
        return data
    }
}
