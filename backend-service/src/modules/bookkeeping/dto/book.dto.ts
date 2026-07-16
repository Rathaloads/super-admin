import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, isString, IsString, Length } from "class-validator";
import { eBookRecordType, eBookType } from "../constant/types";
import { PaginationDto } from "@/common/dto/pagnation.dto";

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

    @IsEnum(eBookRecordType)
    recordType: eBookRecordType;

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
    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @IsNumber()
    @IsOptional()
    amount?: number = 0;

    @IsEnum(eBookRecordType)
    @IsOptional()
    recordType?: eBookRecordType;

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
    @IsNumber()
    bookId: number;

    @IsNumber()
    @IsOptional()
    categoryId?: number;

    @IsEnum(eBookRecordType)
    @IsOptional()
    recordType?: eBookRecordType;

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