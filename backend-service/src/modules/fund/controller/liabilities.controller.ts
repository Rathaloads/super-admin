import { Controller, Get, Logger, Param, Post, Query } from "@nestjs/common";
import { LiabilitiesService } from "../service/liabilities.service";
import { QueryLiabilitiesListDto } from "../dto/liabilities.dto";

@Controller('liabilities')
export class LiabilitiesController {
    private readonly logger = new Logger(LiabilitiesController.name);

    constructor(private readonly liabilitiesService: LiabilitiesService) {}

    @Get("list")
    async getList(@Query() dto: QueryLiabilitiesListDto) {}

    @Post("delete/:id")
    async delete(@Param("id") id: string) {}
}