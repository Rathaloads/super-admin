import { Controller, Post, Body, Get, Put, Param, Delete, Logger, Query } from "@nestjs/common";
import { CreateAccountDto, UpdateAccountDto } from "../dto/book.dto";
import { BookkeepingService } from "../service/bookkeeping.service";

@Controller('bookkeeping/account')
export class AccountController {
    private readonly logger = new Logger(AccountController.name);

    constructor(private readonly bookkeepingService: BookkeepingService) {}

    @Post()
    public async createAccount(@Body() dto: CreateAccountDto) {
        const data = await this.bookkeepingService.CreateAccount(dto);
        return data
    }

    @Get('all')
    public async getAllAccount() {
        const data = await this.bookkeepingService.QueryAllAccount();
        return data
    }

    @Get()
    public async getAccountList(@Query('bookId') bookId: number) {
        const data = await this.bookkeepingService.QueryAccount(bookId);
        return data
    }

    @Put(':id')
    public async updateAccount(@Param('id') id: number, @Body() dto: UpdateAccountDto) {
        const data = await this.bookkeepingService.UpdateAccount(id, dto);
        return data
    }

    @Delete(':id')
    public async deleteAccount(@Param('id') id: number) {
        const data = await this.bookkeepingService.RemoveAccount(id);
        return data
    }
}