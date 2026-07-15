import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { eRepaymentType, eRepaymentStatus } from "../constant/types";

// 负债表
@Entity('liabilities')
export class LiabilitiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", comment: "流水ID"})
  fundId: number;

  @Column({ type: "varchar", length: 255})
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 64, comment: '平台' })
  platform: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '本金' })
  amount: number;

  @Column({ type: "int", comment: '分期数' })
  installments: number;

  @Column({ type: "decimal", precision: 10, scale: 2, comment: '年利率' })
  interestRate: number;

  @Column({ type: 'enum', enum: eRepaymentType, comment: '还款方式' })
  repaymentType: eRepaymentType;

  @Column({ type: "int", comment: '每月还款日' })
  repaymentDay: number;

  @Column({ type: "datetime", comment: '借款时间' })
  borrowTime: Date;
  
  @Column({ type: "datetime", comment: '开始还款时间' })
  startRepaymentTime: Date;

  @Column({ type: "int", default: 0, comment: '状态: 0-进行中, 1-已结清' })
  status: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
  createdAt: Date;
}

@Entity("liabilities_plant")
export class LiabilitiesPlantEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'int', comment: '关联负债ID' })
  liabilitiesId: number;

  @Column({ type: "int", comment: "当前期数"})
  currentPeriod: number;

  @Column({ type: "datetime", comment: '还款时间' })
  repaymentTime: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, comment: '还款金额' })
  repaymentAmount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, comment: '本金' })
  amount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, comment: '利息' })
  interest: number;

  @Column({ type: "decimal", precision: 10, scale: 2, comment: '剩余本金' })
  remainingAmount: number;

  @Column({ type: "enum", enum: eRepaymentStatus, comment: '还款状态'})
  repaymentStatus: eRepaymentStatus;
}