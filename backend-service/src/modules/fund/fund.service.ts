import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FundCategoryEntity, FundEntity, FundLiabilitiesEntity, FundLiabilitiesInstallmentEntity } from './entities/fund.entity';
import { CreateAndUpdateFundCategoryDto, CreateFundDto, CreateFundLiabilitiesDto } from './dto/fund.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_CODE } from 'src/common/constant/error-code';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import Redis from 'ioredis';
import { PaginationDto } from 'src/common/dto/pagnation.dto';
import { eRepaymentStatus } from './types';


@Injectable()
export class FundService {
  private readonly logger = new Logger(FundService.name);

  constructor(
    @InjectRepository(FundCategoryEntity)
    private readonly fundCategoryRepository: Repository<FundCategoryEntity>,
    @InjectRepository(FundEntity)
    private readonly fundRepository: Repository<FundEntity>,
    @InjectRepository(FundLiabilitiesEntity)
    private readonly fundLiabilitiesRepository: Repository<FundLiabilitiesEntity>,
    @InjectRepository(FundLiabilitiesInstallmentEntity)
    private readonly fundLiabilitiesInstallmentRepository: Repository<FundLiabilitiesInstallmentEntity>,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ){}

  // 创建分类
  async createFundCategory(dto: CreateAndUpdateFundCategoryDto): Promise<FundCategoryEntity> {
    const data = this.fundCategoryRepository.create(dto);
    const saved = await this.fundCategoryRepository.save(data);
    this.logger.log(`创建流水分类: ${saved}`);
    return saved;
  }

  // 更新分类
  async updateFundCategory(dto: CreateAndUpdateFundCategoryDto): Promise<FundCategoryEntity> {
    const data = await this.fundCategoryRepository.findOne({ where: { id: dto.id, isDeleted: 0 } });
    if (!data) {
      throw new BusinessException(ERROR_CODE.DATA_NOT_FOUND.code, ERROR_CODE.DATA_NOT_FOUND.message);
    }
    Object.assign(data, dto);
    const saved = await this.fundCategoryRepository.save(data);
    this.logger.log(`更新流水分类: ${saved}`);
    return saved;
  }

  // 获取所有分类
  async getAllFundCategoryList(): Promise<FundCategoryEntity[]> {
    const cached = await this.redis.get('fund_category_list');
    if (cached) {
      this.logger.debug(`命中 Redis 缓存: fund_category_list`);
      return JSON.parse(cached) as FundCategoryEntity[];
    }
    const data = await this.fundCategoryRepository.find({ where: { isDeleted: 0 } });
    await this.redis.setex('fund_category_list', 3600, JSON.stringify(data));
    this.logger.debug(`写入 Redis 缓存: fund_category_list`);
    return data;
  }

  // 删除分类
  async deleteFundCategory(id: number): Promise<void> {
    const data = await this.fundCategoryRepository.findOne({ where: { id, isDeleted: 0 } });
    if (!data) {
      throw new BusinessException(ERROR_CODE.DATA_NOT_FOUND.code, ERROR_CODE.DATA_NOT_FOUND.message);
    }
    const subData = await this.fundCategoryRepository.find({ where: { parentId: id, isDeleted: 0 } });
    if (subData.length > 0) {
      throw new BusinessException(ERROR_CODE.CATEGORY_HAS_SUB_CATEGORY.code, ERROR_CODE.CATEGORY_HAS_SUB_CATEGORY.message);
    }
    data.isDeleted = 1;
    await this.fundCategoryRepository.save(data);
    this.logger.log(`删除流水分类: ${id}`);
  }

  // 分页获取流水列表
  async getFundList(dto: PaginationDto): Promise<{ data: FundEntity[], total: number }> {
    const { Page, PageSize } = dto;
    const [data, total] = await this.fundRepository.findAndCount({
      skip: (Page - 1) * PageSize,
      take: PageSize,
    });
    return {data, total};
  }

  // 创建流水
  async createFund(dto: CreateFundDto): Promise<FundEntity> {
    const data = this.fundRepository.create(dto);
    const saved = await this.fundRepository.save(data);
    this.logger.log(`创建流水: ${saved}`);
    return saved;
  }

  // 删除流水
  async deleteFund(id: number): Promise<void> {
    const data = await this.fundRepository.findOne({ where: { id } });
    if (!data) {
      throw new BusinessException(ERROR_CODE.DATA_NOT_FOUND.code, ERROR_CODE.DATA_NOT_FOUND.message);
    }
    await this.fundRepository.delete(id);
    this.logger.log(`删除流水: ${id}`);
  }


  async createFundLiabilities(dto: CreateFundLiabilitiesDto) {
    const data = this.fundLiabilitiesRepository.create(dto);
    const saved = await this.fundLiabilitiesRepository.save(data);
    return saved;
  }

}
