import { Module } from '@nestjs/common';
import { FundService } from './service/fund.service';
import { FundController } from './controller/fund.controller';
import { LiabilitiesController } from './controller/liabilities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundEntity } from './entities/fund.entity';
import { LiabilitiesService } from './service/liabilities.service';
import { LiabilitiesEntity, LiabilitiesPlantEntity } from './entities/liabilities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FundEntity, LiabilitiesEntity, LiabilitiesPlantEntity]),
  ],
  controllers: [FundController, LiabilitiesController],
  providers: [FundService, LiabilitiesService],
})
export class FundModule {}
