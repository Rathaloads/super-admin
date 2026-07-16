import { PaginationDto } from "@/common/dto/pagnation.dto";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { eBookRecordType } from "../constant/types";

export class QueryCategoryDto extends PaginationDto {
    @Type(() => Number)
    @IsEnum(eBookRecordType)
    @IsOptional()
    type?: eBookRecordType;

    @IsString()
    @IsOptional()
    name?: string;
}

export class CreateCategoryDto {
    @IsString()
    name: string;
    
    @IsEnum(eBookRecordType)
    type: eBookRecordType;

    @IsString()
    icon: string;
}

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(eBookRecordType)
    @IsOptional()
    type?: eBookRecordType;

    @IsString()
    @IsOptional()
    icon?: string;
}
