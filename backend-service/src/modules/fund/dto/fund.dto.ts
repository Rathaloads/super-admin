import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { eFundType } from "../types";

export class CreateAndUpdateFundCategoryDto {
    @IsOptional()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsNumber()
    parentId?: number;

    @IsEnum(eFundType)
    type: eFundType;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    icon?: string;
}

export class CreateFundDto {
    @IsEnum(eFundType)
    type: eFundType;

    @IsArray()
    @IsNumber({}, { each: true })
    categoryIds: number[];

    @IsArray()
    @IsString({ each: true })
    categoryName: string[];

    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    remark?: string;

    @IsOptional()
    @IsString()
    extend?: string;
}