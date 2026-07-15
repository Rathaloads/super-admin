import { Type } from "class-transformer";
import { IsIn, IsInt, IsNumber, Min } from "class-validator";

export class PaginationDto {
    @Type(() => Number)
    @IsNumber()
    @IsInt()
    @Min(1)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @IsInt()
    @Min(1)
    pageSize: number;
}