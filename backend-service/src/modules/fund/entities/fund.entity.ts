import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { eFundType, eRepaymentStatus } from '../types';

// 流水分类
@Entity('fund_category')
export class FundCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default:0, comment: '父级ID' })
  parentId: number;

  @Column({ type: 'enum', enum: eFundType, comment: '流水类型' })
  type: eFundType;

  @Column({ type: 'varchar', nullable: true, length: 64, comment: '名称' })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 64, comment: '图标' })
  icon?: string;

  @Column({ type: 'int', default:0, comment: '是否删除'})
  isDeleted: number;
}

// 流水表
@Entity('fund')
export class FundEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: eFundType, comment: '流水类型' })
  type: eFundType;

  @Column({ type: 'simple-array', nullable: true, comment: '分类ID' })
  categoryIds?: number[];

  @Column({ type: 'simple-array', nullable: true, comment: '分类名称' })
  categoryName?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '金额' })
  amount: number;

  @Column({ type: 'varchar', nullable: true, length: 64, comment: '备注' })
  remark?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true, length: 1024, comment: '拓展字段' })
  extend?: string;
}


// 负债表
@Entity('fund_liabilities')
export class FundLiabilitiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, length: 64, comment: '平台' })
  platform: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '本金' })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '利息' })
  interest: number;

  @Column({ type: 'datetime', comment: '借款时间' })
  borrowTime: Date;

  @Column({ type: 'datetime', comment: '开始时间' })
  startTime: Date;

  @Column({ type: 'datetime', comment: '结束时间' })
  endTime: Date;

  @Column({ type: 'int', comment: '分期数' })
  installments: number;

  @Column({ type: 'decimal', comment: '每期还款金额' })
  installmentAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '已还款金额' })
  repaidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '剩余还款金额' })
  remainingAmount: number;

  @Column({ type: 'varchar', nullable: true, length: 64, comment: '备注' })
  remark?: string;

  @Column({ type: 'varchar', nullable: true, length: 64, comment: '拓展字段' })
  extend?: string;
}

// 负债分期表
@Entity('fund_liabilities_installment')
export class FundLiabilitiesInstallmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '关联负债ID' })
  liabilitiesId: number;

  @Column({ type: 'datetime', comment: '还款时间' })
  repaymentTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '还款金额' })
  repaymentAmount: number;

  @Column({ type: 'datetime', comment: '实际还款时间' })
  actualRepaymentTime: Date;

  @Column({ type: 'enum', enum: eRepaymentStatus, comment: '还款状态'})
  repaymentStatus: eRepaymentStatus;
}