import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Put, Query } from '@nestjs/common';
import { FundService } from './fund.service';
import { CreateFundDto } from './dto/fund.dto';
import { CreateAndUpdateFundCategoryDto } from './dto/fund.dto';
import { PaginationDto } from 'src/common/dto/pagnation.dto';

@Controller('fund')
export class FundController {
  private readonly logger = new Logger(FundController.name);

  constructor(private readonly fundService: FundService) {}

  @Post('category')
  async createFundCategory(@Body() dto: CreateAndUpdateFundCategoryDto) {
    this.logger.log(`创建流水分类: ${dto.name}`);
    return this.fundService.createFundCategory(dto);
  }

  @Put('category')
  async updateFundCategory(@Body() dto: CreateAndUpdateFundCategoryDto) {
    this.logger.log(`更新流水分类: ${dto.name}`);
    return this.fundService.updateFundCategory(dto);
  }

  @Delete('category/:id')
  async deleteFundCategory(@Param('id') id: number) {
    this.logger.log(`删除流水分类: ${id}`);
    return this.fundService.deleteFundCategory(id);
  }

  @Get('category')
  async getAllFundCategoryList() {
    this.logger.log(`获取所有流水分类`);
    return this.fundService.getAllFundCategoryList();
  }

  @Get('fund-list')
  async getFundList(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    let dto = new PaginationDto();
    dto.Page = page;
    dto.PageSize = pageSize;
    return this.fundService.getFundList(dto);
  }

  @Post('create-fund')
  async createFund(@Body() dto: CreateFundDto) {
    this.logger.log(`创建流水: ${dto}`);
    return this.fundService.createFund(dto);
  }

  @Delete('delete-fund/:id')
  async deleteFund(@Param('id') id: number) {
    this.logger.log(`删除流水: ${id}`);
    return this.fundService.deleteFund(id);
  }

}
