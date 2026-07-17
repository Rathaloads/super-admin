import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, isString, IsString, Length } from "class-validator";
import { eBookRecordType, eBookType } from "../constant/types";
import { PaginationDto } from "@/common/dto/pagnation.dto";
import { Type } from "class-transformer";

export class CreateBookDto {
    @IsEnum(eBookType, { message: "类型错误" })
    bookType: eBookType;

    @IsString()
    @IsNotEmpty()
    @Length(1, 20, { message: "名称长度必须在1-20个字符之间" })
    bookName: string;

    @IsString()
    @IsOptional()
    currencyType?: string;
}

export class UpdateBookDto {
    @IsEnum(eBookType, { message: "类型错误" })
    @IsOptional()
    bookType?: eBookType;

    @IsString()
    @IsOptional()
    @Length(1, 20, { message: "名称长度必须在1-20个字符之间" })
    bookName?: string;
}


export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 20, { message: "名称长度必须在1-20个字符之间" })
    accountName: string;

    @IsString()
    @IsOptional()
    bankName?: string;

    @IsString()
    @IsOptional()
    bankNumber?: string;

    @IsNumber()
    balance: number;

    @IsNumber()
    bookId: number;
}

export class UpdateAccountDto {
    @IsString()
    @IsOptional()
    accountName?: string;

    @IsString()
    @IsOptional()
    bankName?: string;


    @IsString()
    @IsOptional()
    bankNumber?: string;

    @IsNumber()
    @IsOptional()
    balance?: number;
}

export class CreateBookRecordDto {
    @IsNumber()
    bookId: number;

    @IsNumber()
    accountId: number;

    @IsNumber()
    categoryId: number;

    @IsNumber()
    amount: number;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @IsString()
    @IsOptional()
    remark?: string;

    @IsString()
    @IsOptional()
    extend?: string;
}

export class UpdateBookRecordDto {
    @Type(() => Number)
    @IsOptional()
    categoryId?: number;

    @Type(() => Number)
    @IsOptional()
    accountId?: number;

    @Type(() => Number)
    @IsOptional()
    amount?: number = 0;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[] = [];

    @IsString()
    @IsOptional()
    remark?: string = "";

    @IsString()
    @IsOptional()
    extend?: string = "";
}

export class QueryBookRecordDto extends PaginationDto {
    @Type(() => Number)
    bookId: number;

    @Type(() => Number)
    @IsOptional()
    categoryId?: number;

    @Type(() => Number)
    @IsOptional()
    accountId?: number;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsDateString({ strict: true })
    startDate?: string;

    @IsOptional()
    @IsDateString({ strict: true })
    endDate?: string;

}