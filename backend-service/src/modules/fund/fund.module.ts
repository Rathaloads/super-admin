import { Module } from '@nestjs/common';
import { FundService } from './fund.service';
import { FundController } from './fund.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundCategoryEntity, FundEntity, FundLiabilitiesEntity, FundLiabilitiesInstallmentEntity } from './entities/fund.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FundCategoryEntity, FundEntity, FundLiabilitiesEntity, FundLiabilitiesInstallmentEntity]),
  ],
  controllers: [FundController],
  providers: [FundService],
})
export class FundModule {}
