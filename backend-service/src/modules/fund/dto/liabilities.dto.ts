import { PaginationDto } from "@/common/dto/pagnation.dto";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { eLoanPlatform, eRepaymentType } from "../constant/types";
import { Type } from "class-transformer";

export class QueryLiabilitiesListDto extends PaginationDto {
    @IsEnum(eLoanPlatform)
    @IsString()
    @IsOptional()
    platform?: eLoanPlatform; // 平台

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    status?: number; // 状态
    
}
