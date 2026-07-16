import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query } from "@nestjs/common";
import { CreateCategoryDto, QueryCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { BookkeepingService } from "../service/bookkeeping.service";

@Controller('bookkeeping/category')

export class CategoryController {
    private readonly logger = new Logger(CategoryController.name);

    constructor(private readonly bookkeepingService: BookkeepingService) {}

    @Post()
    public async createCategory(@Body() dto: CreateCategoryDto) {
        const data = await this.bookkeepingService.CreateCategory(dto);
        return data
    }

    @Get()
    public async getAllCategory(@Query() dto: QueryCategoryDto) {
        const data = await this.bookkeepingService.QueryCategory(dto);
        return data
    }

    @Put(':id')
    public async updateCategory(@Param('id') id: number, @Body() dto: UpdateCategoryDto) {
        const data = await this.bookkeepingService.UpdateCategory(id, dto);
        return data
    }

    @Delete(':id')
    public async deleteCategory(@Param('id') id: number) {
        const data = await this.bookkeepingService.RemoveCategory(id);
        return data
    }
}