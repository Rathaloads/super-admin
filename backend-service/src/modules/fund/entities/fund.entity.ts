import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { eFundType, eRepaymentStatus, eRepaymentType } from '../constant/types';

// 流水表
@Entity('fund')
export class FundEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: eFundType, comment: '流水类型' })
  type: eFundType;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '金额' })
  amount: number;

  @Column({ type: 'simple-array', nullable: true, comment: '流水TAG' })
  tags?: string[];

  @Column({ type: 'varchar', nullable: true, length: 64, comment: '备注' })
  remark?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true, length: 1024, comment: '拓展字段' })
  extend?: string;
}