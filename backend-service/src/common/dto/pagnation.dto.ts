import { IsNumber } from "class-validator";

export class PaginationDto {
    @IsNumber()
    Page: number;

    @IsNumber()
    PageSize: number;
}