import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** 系统用户表（示例实体） */
@Entity('sys_user')
export class SysUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, unique: true, comment: '邮箱' })
  mail: string;

  @Column({ type: 'varchar', length: 64, comment: '密码' })
  password: string;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: '昵称' })
  nickname: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: '头像' })
  avatar: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '创建时间' })
  createdAt: Date;
}
