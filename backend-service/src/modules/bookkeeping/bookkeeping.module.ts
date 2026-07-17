import { Module } from '@nestjs/common';
import { BookController } from './controller/book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity, BookEntity, BookRecordCategoryEntity, BookRecordEntity } from './entities/book.entity';
import { BookkeepingService } from './service/bookkeeping.service';
import { BusinessService } from './service/business.service';
import { CategoryController } from './controller/category.controller';
import { RecordController } from './controller/record.controller';
import { AccountController } from './controller/account.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, AccountEntity, BookRecordCategoryEntity, BookRecordEntity])
  ],
  controllers: [BookController, CategoryController, AccountController, RecordController],
  providers: [
    BookkeepingService,BusinessService
  ],
})
export class BookkeepingModule {}
