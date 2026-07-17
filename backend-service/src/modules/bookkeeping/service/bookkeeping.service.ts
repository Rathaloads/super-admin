import { Injectable, Logger } from "@nestjs/common";
import { eBookRecordType } from "../constant/types";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { AccountEntity, BookEntity, BookRecordCategoryEntity, BookRecordEntity } from "../entities/book.entity";
import { DataSource, In, Repository } from "typeorm";
import { BusinessException } from "@/common/exceptions/business.exception";
import { CreateCategoryDto, QueryCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { CreateAccountDto, CreateBookDto, CreateBookRecordDto, QueryBookRecordDto, UpdateAccountDto, UpdateBookDto, UpdateBookRecordDto } from "../dto/book.dto";

@Injectable()
export class BookkeepingService {
    private readonly logger = new Logger(BookkeepingService.name);

    constructor(
        @InjectRepository(BookRecordCategoryEntity)
        private readonly bookRecordCategoryRepository: Repository<BookRecordCategoryEntity>,

        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,

        @InjectRepository(AccountEntity)
        private readonly accountRepository: Repository<AccountEntity>,

        @InjectRepository(BookRecordEntity)
        private readonly bookRecordRepository: Repository<BookRecordEntity>,

        @InjectDataSource()
        private readonly dataSource: DataSource,
    ){}

    // 创建分类
    public async CreateCategory(dto: CreateCategoryDto):Promise<BookRecordCategoryEntity> {
        const hasCategory = await this.bookRecordCategoryRepository.findOne({
            where: {
                categoryName: dto.name,
                categoryType: dto.type,
            }
        })
        if (hasCategory) {
            throw new BusinessException(400,"Category already exists");
        }
        const category = await this.bookRecordCategoryRepository.save({
            categoryName: dto.name,
            categoryType: dto.type,
            icon: dto.icon,
        })
        return category;
    }

    // 查询分类
    public async QueryCategory(dto: QueryCategoryDto):Promise<{ data: BookRecordCategoryEntity[], total: number }> {
        const qb = this.bookRecordCategoryRepository.createQueryBuilder("category");
        qb.where("category.isDeleted = :isDeleted", { isDeleted: false });
        if (dto.type) {
            qb.andWhere("category.categoryType = :type", { type: dto.type });
        }
        if (dto.name) {
            qb.andWhere("category.categoryName LIKE :name", { name: `%${dto.name}%` });
        }
        const [data, total] = await qb.skip((dto.page - 1) * dto.pageSize).take(dto.pageSize).getManyAndCount();
        return { data, total };
    }

    // 更新分类
    public async UpdateCategory(id: number, dto: UpdateCategoryDto) {
        const category = await this.bookRecordCategoryRepository.findOne({
            where: {
                id: id,
            }
        })
        if (!category) {
            throw new BusinessException(400,"Category not found");
        }
        if (dto.name) {
            category.categoryName = dto.name;
        }
        if (dto.type) {
            category.categoryType = dto.type;
        }
        if (dto.icon) {
            category.icon = dto.icon;
        }
        await this.bookRecordCategoryRepository.save(category);
        return this.bookRecordCategoryRepository.findOne({ where: { id: id } });
    }

    // 删除分类
    public async RemoveCategory(id: number) {
        const category = await this.bookRecordCategoryRepository.findOne({
            where: {
                id: id,
            }
        })
        if (!category) {
            throw new BusinessException(400,"Category not found");
        }
        if (category.isDeleted) {
            throw new BusinessException(400,"Category already deleted");
        }
        await this.bookRecordCategoryRepository.update(id, { isDeleted: true });
    }

    // 创建账本
    public async CreateBook(dto: CreateBookDto) {
        const result = this.dataSource.transaction(async (transactionalEntityManager) => {
            let book = new BookEntity();
            book.bookType = dto.bookType;
            book.bookName = dto.bookName;
            book.currencyType = dto.currencyType || "CNY";
            return await transactionalEntityManager.save(BookEntity, book);
        })
        return result;
    }

    public async QueryAllBook() {
        const list = await this.bookRepository.find()
        return list;
    }

    public async UpdateBook(id: number, dto: UpdateBookDto) {
        const result = this.dataSource.transaction(async (transactionalEntityManager) => {
            const book = await transactionalEntityManager.findOne(BookEntity, {
                where: {
                    id: id,
                }
            })
            if (!book) {
                throw new BusinessException(400,"Book not found");
            }
            if (dto.bookType) {
                book.bookType = dto.bookType;
            }
            if (dto.bookName) {
                book.bookName = dto.bookName;
            }
            const { affected } = await transactionalEntityManager.update(BookEntity, id, book);
            return affected;
        })
        return result;
    }

    public async RemoveBook(id: number) {
        const accountResult = await this.accountRepository.findAndCount({where: { book: { id: id } } })
        if (accountResult[1] > 0) {
            throw new BusinessException(400,"Book has accounts");
        }
        const recordResult = await this.bookRecordRepository.findAndCount({where: { book: { id: id } } })
        if (recordResult[1] > 0) {
            throw new BusinessException(400,"Book has records");
        }
        await this.bookRepository.delete(id);
    }

    // 创建账户
    public async CreateAccount(dto: CreateAccountDto) {
        let book = await this.bookRepository.findOne({where: { id: dto.bookId } })
        if (!book) {
            throw new BusinessException(400,"Book not found");
        }
        let account = new AccountEntity();
        account.accountName = dto.accountName;
        account.bankName = dto.bankName;
        account.bankNumber = dto.bankNumber;
        account.balance = dto.balance;
        account.book = book;
        return await this.accountRepository.save(account);
    }

    public async QueryAllAccount() {
        const list = await this.accountRepository.find({ relations:{
            book: true,
        } })
        return list;
    }

    public async QueryAccount(bookId: number) {
        const list = await this.accountRepository.find({
            relations: {
                book: true,
            },
            where: {
                book: {
                    id: bookId,
                }
            }
        })
        return list;
    }

    public async UpdateAccount(id: number, dto: UpdateAccountDto) {
        const account = await this.accountRepository.findOne({where: { id: id } })
        if (!account) {
            throw new BusinessException(400,"Account not found");
        }
        await this.accountRepository.update(id, dto);
        return this.accountRepository.findOne({ where: { id: id } });
    }

    public async RemoveAccount(id: number) {
        await this.accountRepository.delete(id);
    }

    // 创建账单
    public async CreateBookRecord(dto: CreateBookRecordDto) {
        const data = await this.bookRecordRepository.save({
            book: { id: dto.bookId },
            account: { id: dto.accountId },
            category: { id: dto.categoryId},
            tags: dto.tags,
            amount: dto.amount,
            remark: dto.remark,
            extend: dto.extend,
        });
        return data
    }

    public async UpdateBookRecord(id: number, dto: UpdateBookRecordDto) {
        const data = await this.bookRecordRepository.update(id, dto);
        return data
    }

    public async RemoveBookRecord(id: number) {
        await this.bookRecordRepository.delete(id);
    }

    public async QueryBookRecord(dto: QueryBookRecordDto) {
        const qb = this.bookRecordRepository.createQueryBuilder("record");
        qb.leftJoinAndSelect("record.book", "book");
        qb.leftJoinAndSelect("record.account", "account");
        qb.leftJoinAndSelect("record.category", "category");
        if (dto.bookId) {
            qb.andWhere("record.bookId = :bookId", { bookId: dto.bookId });
        }
        if (dto.categoryId) {
            qb.andWhere("record.categoryId = :categoryId", { categoryId: dto.categoryId });
        }
        if (dto.accountId) {
            qb.andWhere("record.recordType = :recordType", { accountId: dto.accountId });
        }
        if (dto.tags) {
            qb.andWhere("record.tags @> :tags", { tags: dto.tags });
        }
        if (dto.startDate && dto.endDate) {
            qb.andWhere("record.createdAt BETWEEN :startDate AND :endDate", { startDate: dto.startDate, endDate: dto.endDate });
        }
        const [data, total] = await qb.skip((dto.page - 1) * dto.pageSize).take(dto.pageSize).getManyAndCount();
        return { data, total };
    }
}