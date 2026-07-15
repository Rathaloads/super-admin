import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LiabilitiesEntity, LiabilitiesPlantEntity } from "../entities/liabilities.entity";
import { Repository } from "typeorm";
import { QueryLiabilitiesListDto } from "../dto/liabilities.dto";

@Injectable()
export class LiabilitiesService {
    constructor(
        @InjectRepository(LiabilitiesEntity)
        private readonly liabilitiesRepository: Repository<LiabilitiesEntity>,

        @InjectRepository(LiabilitiesPlantEntity)
        private readonly liabilitiesPlantRepository: Repository<LiabilitiesPlantEntity>,
    ){}

    public async GetList(query: QueryLiabilitiesListDto) {
        const { page, pageSize, platform, status } = query;
        const qb = this.liabilitiesRepository.createQueryBuilder('liabilities');
        if (platform) {
            qb.andWhere('liabilities.platform = :platform', { platform });
        }
        if (status) {
            qb.andWhere('liabilities.status = :status', { status });
        }
        qb.orderBy('liabilities.createdAt', 'DESC');
        const [list, total] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
        return { list, total };
    }

    
}