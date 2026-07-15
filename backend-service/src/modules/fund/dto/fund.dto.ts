import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator"
import { eFundType, eLoanPlatform, eRepaymentStatus, eRepaymentType } from "../constant/types";
import { PaginationDto } from "@/common/dto/pagnation.dto";
import { FundEntity } from "../entities/fund.entity";

export class QueryFundListDto extends PaginationDto {
    // 类型
    @Type(() => Number)
    @IsEnum(eFundType)
    @IsOptional()
    type?: eFundType;

    // 创建时间段[开始时间, 结束时间]
    @IsArray()
    @IsDateString({ strict: true }, { each: true })
    @IsOptional()
    createTime?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}

export class QueryFundListResponseDto {
    list: FundEntity[];
    total: number;
}


export class CreateFundDto {
    @IsEnum(eFundType)
    type: eFundType;

    @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
    amount: number;

    @ValidateIf(o => o.type === eFundType.LOAN)
    @IsNotEmpty({ message: '分期数不能为空' })
    @IsNumber()
    installments?: number;

    @ValidateIf(o => o.type === eFundType.LOAN)
    @IsNotEmpty({ message: '年利率不能为空' })
    @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
    interestRate?: number;

    @ValidateIf(o => o.type === eFundType.LOAN)
    @IsNotEmpty({ message: '还款方式不能为空' })
    @IsEnum(eRepaymentType)
    repaymentType?: eRepaymentType;

    @ValidateIf(o => o.type === eFundType.LOAN || o.type === eFundType.REPAYMENT)
    @IsNotEmpty({ message: '平台不能为空' })
    @IsString()
    platform?: string;

    @ValidateIf(o => o.type === eFundType.LOAN)
    @IsNotEmpty({ message: '每月还款日不能为空' })
    @IsNumber()
    repaymentDay?: number;

    @ValidateIf(o => o.type === eFundType.LOAN)
    @IsNotEmpty({ message: '开始还款时间不能为空' })
    startRepaymentTime?: String;

    @ValidateIf(o => o.type === eFundType.REPAYMENT)
    @IsNotEmpty({ message: '还款时间不能为空' })
    repaymentTime?: String;

    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @IsOptional()
    @IsString()
    remark?: string;

    @IsOptional()
    @IsString()
    extend?: string;
}

// 负债
export class CreateFundLiabilitiesDto {
    @IsString()
    platform: string;

    @IsNumber()
    amount: number;

    @IsNumber()
    interest: number;

    @IsDate()
    borrowTime: Date;

    @IsDate()
    startTime: Date;

    @IsDate()
    endTime: Date;

    @IsNumber()
    installments: number;

    @IsNumber()
    installmentAmount: number;

    @IsNumber()
    repaidAmount: number;

    @IsNumber()
    remainingAmount: number;

    @IsOptional()
    @IsString()
    remark?: string;

    @IsOptional()
    @IsString()
    extend?: string;
}