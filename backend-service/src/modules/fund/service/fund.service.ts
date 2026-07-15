import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FundEntity } from '../entities/fund.entity';
import { CreateFundDto, CreateFundLiabilitiesDto, QueryFundListDto } from '../dto/fund.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_CODE } from 'src/common/constant/error-code';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import Redis from 'ioredis';
import { PaginationDto } from 'src/common/dto/pagnation.dto';
import { eFundType, eLoanPlatform, eRepaymentStatus, eRepaymentType } from '../constant/types';
import { wldLoanCalculate, equalPrincipalLoanCalculate, equalPrincipalAndInterestLoanCalculate } from "@/utils/loan.utils"
import { LiabilitiesEntity, LiabilitiesPlantEntity } from '../entities/liabilities.entity';


@Injectable()
export class FundService {
  private readonly logger = new Logger(FundService.name);

  constructor(
    @InjectRepository(FundEntity)
    private readonly fundRepository: Repository<FundEntity>,
    @InjectRepository(LiabilitiesEntity)
    private readonly fundLiabilitiesRepository: Repository<LiabilitiesEntity>,
    @InjectRepository(LiabilitiesPlantEntity)
    private readonly liabilitiesPlantRepository: Repository<LiabilitiesPlantEntity>,

    @InjectDataSource()
    private readonly dataSource: DataSource,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) { }

  async getFundList(dto: QueryFundListDto): Promise<{ data: FundEntity[], total: number }> {
    const { page, pageSize } = dto;
    this.logger.log(`查询流水列表: ${JSON.stringify(dto)}`);
    let resp = this.fundRepository.createQueryBuilder('fund');
    if (dto.type) {
      resp.andWhere('fund.type = :type', { type: dto.type });
    }
    // if (dto.platform) {
    //   resp.andWhere('fund.platform = :platform', { platform: dto.platform });
    // }
    if (dto.createTime) {
      resp.andWhere('fund.createdAt BETWEEN :start AND :end', { start: dto.createTime[0], end: dto.createTime[1] });
    }
    if (dto.tags) {
      resp.andWhere('fund.tags IN (:...tags)', { tags: dto.tags });
    }
    resp.skip((page - 1) * pageSize).take(pageSize);

    const [data, total] = await resp.getManyAndCount();
    return { data, total };
  }

  async createFund(dto: CreateFundDto): Promise<Boolean> {
    this.logger.log(`创建流水: ${dto}`);
    if (dto.type === eFundType.LOAN) {
      await this._handleInsertLoan(dto);
    } else if (dto.type === eFundType.REPAYMENT) {
      await this._handleInsertRepayment(dto);
    } else {
      await this._handleInsertFund(dto);
    }
    return true;
  }
  // 处理插入贷款
  private async _handleInsertLoan(dto: CreateFundDto) {
    // 处理特平台的贷款信息
    if (dto.platform === eLoanPlatform.WLD) {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        // 创建一个流水
        let fund = await transactionalEntityManager.save(FundEntity, {
          type: dto.type,
          amount: dto.amount,
          tags: dto.tags,
          remark: dto.remark,
          extend: dto.extend,
        });
        // 创建负债记录
        let liabilities = await transactionalEntityManager.save(LiabilitiesEntity, {
          fundId: fund.id,
          name: `${dto.platform}_${fund.createdAt.toISOString().split('T')[0]}_${fund.amount.toFixed(2)}`,
          platform: dto.platform,
          amount: dto.amount,
          installments: dto.installments,
          interestRate: dto.interestRate,
          repaymentType: dto.repaymentType,
          repaymentDay: dto.repaymentDay,
          borrowTime: fund.createdAt,
          startRepaymentTime: dto.startRepaymentTime,
          status: 0,
        })
        // 创建分期计划
        const plants = wldLoanCalculate(dto.amount, liabilities.interestRate, fund.createdAt, new Date(liabilities.startRepaymentTime), liabilities.installments);
        const plantDatas: any[] = [];
        for (let i = 0; i < plants.length; i++) {
          const item = plants[i];
          plantDatas.push({
            liabilitiesId: liabilities.id,
            currentPeriod: item.period,
            repaymentTime: item.dueDate,
            repaymentAmount: item.payment / 100,
            amount: item.principal / 100,
            interest: item.interest / 100,
            remainingAmount: item.remainingPrincipal / 100,
            repaymentStatus: eRepaymentStatus.PENDING,
          })
        }
        await transactionalEntityManager.save(LiabilitiesPlantEntity, plantDatas);
      });
      return true;
    } else if (dto.platform === eLoanPlatform.OTHER) {
      await this._handleOtherLoan(dto);
    } else {
      throw new BusinessException(400, '贷款平台不支持');
    }
  }
  
  // 处理其它平台贷款（基于等额本息和等额本金的计算方式）
  private async _handleOtherLoan(dto: CreateFundDto) {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // 创建一个流水
      let fund = await transactionalEntityManager.save(FundEntity, {
        type: dto.type,
        amount: dto.amount,
        tags: dto.tags,
        remark: dto.remark,
        extend: dto.extend,
      });
      // 创建负债记录
      let liabilities = await transactionalEntityManager.save(LiabilitiesEntity, {
        fundId: fund.id,
        name: `${dto.platform}_${fund.createdAt.toISOString().split('T')[0]}_${fund.amount.toFixed(2)}`,
        platform: dto.platform,
        amount: dto.amount,
        installments: dto.installments,
        interestRate: dto.interestRate,
        repaymentType: dto.repaymentType,
        repaymentDay: dto.repaymentDay,
        borrowTime: fund.createdAt,
        startRepaymentTime: dto.startRepaymentTime,
        status: 0,
      })
      // 创建分期计划
      let plants: any[] = [];
      if (dto.repaymentType === eRepaymentType.EQUAL_PRINCIPAL) { // 处理等额本金
        plants = equalPrincipalLoanCalculate(dto.amount, liabilities.interestRate, fund.createdAt, new Date(liabilities.startRepaymentTime), liabilities.installments);
      }
      else if (dto.repaymentType === eRepaymentType.EQUAL_INSTALLMENT) { // 处理等额本息
        plants = equalPrincipalAndInterestLoanCalculate(dto.amount, liabilities.interestRate, fund.createdAt, new Date(liabilities.startRepaymentTime), liabilities.installments);
      } else {
        throw new BusinessException(400, '还款方式不支持');
      }
      const plantDatas: any[] = [];
      for (let i = 0; i < plants.length; i++) {
        const item = plants[i];
        plantDatas.push({
          liabilitiesId: liabilities.id,
          currentPeriod: item.period,
          repaymentTime: item.dueDate,
          repaymentAmount: item.totalAmount,
          amount: item.principal,
          interest: item.interest,
          remainingAmount: item.remainingPrincipal / 100,
          repaymentStatus: eRepaymentStatus.PENDING,
        })
      }
      await transactionalEntityManager.save(LiabilitiesPlantEntity, plantDatas);
      return true;
    })
  }

  // 处理插入还款
  private async _handleInsertRepayment(dto: CreateFundDto) { }

  // 处理插入常规流水
  private async _handleInsertFund(dto: CreateFundDto) {
    let entity = new FundEntity();
    entity.type = dto.type;
    entity.amount = dto.amount;
    entity.tags = dto.tags;
    entity.remark = dto.remark;
    entity.extend = dto.extend;
    entity.createdAt = new Date();

    await this.fundRepository.save(entity);
    return true;
  }


  async deleteFund(id: number): Promise<void> {
    const data = await this.fundRepository.findOne({ where: { id } });
    if (!data) {
      throw new BusinessException(ERROR_CODE.DATA_NOT_FOUND.code, ERROR_CODE.DATA_NOT_FOUND.message);
    }
    await this.fundRepository.delete(id);
  }


  async createFundLiabilities(dto: CreateFundLiabilitiesDto) {
    const data = this.fundLiabilitiesRepository.create(dto);
    const saved = await this.fundLiabilitiesRepository.save(data);
    return saved;
  }

}
