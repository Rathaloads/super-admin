import { Injectable, Logger } from "@nestjs/common";
import { BookkeepingService } from "./bookkeeping.service";

@Injectable()
export class BusinessService {
    private readonly logger = new Logger(BusinessService.name);
    
    constructor(
        // 注册bookkeeping.service
        private readonly bookkeepingService: BookkeepingService
    ){}
}