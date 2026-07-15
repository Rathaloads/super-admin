import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Put, Query } from '@nestjs/common';
import { FundService } from '../service/fund.service';
import { CreateFundDto, QueryFundListDto } from '../dto/fund.dto';

@Controller('fund')
export class FundController {
  private readonly logger = new Logger(FundController.name);

  constructor(private readonly fundService: FundService) {}

  @Get('fund-list')
  async getFundList(@Query() dto: QueryFundListDto) {
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
