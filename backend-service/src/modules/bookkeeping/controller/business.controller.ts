import { Controller, Get, Logger } from "@nestjs/common";
import { BusinessService } from "../service/business.service";
import { BookkeepingService } from "../service/bookkeeping.service";

// bookkeeping/business
@Controller()
export class BusinessController {
    private readonly logger = new Logger(BusinessController.name);

    constructor(
        private readonly businessService: BusinessService,
        private readonly bookkeepingService: BookkeepingService
    ) {}

    @Get("bookkeeping/getRecordList")
    public async getRecordList() {
        return "";
    }
}