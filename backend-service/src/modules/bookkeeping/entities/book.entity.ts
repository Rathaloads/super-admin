import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { eBookRecordType, eBookType } from "../constant/types";



@Entity("book")
export class BookEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: eBookType, comment: "账本类型"})
    bookType: eBookType;

    @Column({ type: "varchar", length: 255 })
    bookName: string;

    @Column({ type: "varchar", length: 60, comment: "货币类型", default: "CNY"})
    currencyType: string;
}

@Entity("account")
export class AccountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => BookEntity, (book) => book.id)
    book: BookEntity;

    @Column({ type: "varchar", length: 255, comment: "账户名称" })
    accountName: string;

    @Column({ type: "varchar", length: 255, comment: "银行名称", default: "" })
    bankName?: string;

    @Column({ type: "varchar", length: 255, comment: "银行账号", default: "" })
    bankNumber?: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0, comment: "余额" })
    balance: number;
}

// 账单分类
@Entity("book_record_category")
export class BookRecordCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, comment: "分类名称" })
    categoryName: string;

    @Column({ type: "enum", enum: eBookRecordType, comment: "分类类型" })
    categoryType: eBookRecordType;

    @Column({ type: "varchar", length: 255, nullable: true })
    icon?: string;

    @Column({ type: "boolean", default: false, comment: "是否删除" })
    isDeleted: boolean;
}

// 账单
@Entity("book_record")
export class BookRecordEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => BookEntity, (book) => book.id)
    book: BookEntity;

    @ManyToOne(() => AccountEntity, (account) => account.id)
    account: AccountEntity;

    @Column({ type: "decimal", precision: 10, scale: 2, comment: "金额" })
    amount: number;

    @ManyToOne(() => BookRecordCategoryEntity, (category) => category.id)
    category: BookRecordCategoryEntity;

    @Column({ type: "simple-array", comment: "标签" })
    tags?: string[];

    @Column({ type: "varchar", length: 255, comment: "备注" })
    remark?: string;

    @Column({ type: "datetime", comment: "创建时间", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "varchar", length: 255, comment: "拓展字段", nullable: true })
    extend?: string;
}

// 预算
// ........