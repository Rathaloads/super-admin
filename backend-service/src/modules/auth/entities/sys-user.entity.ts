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

  @Column({ length: 64, unique: true, comment: '邮箱' })
  mail: string;

  @Column({ length: 64, nullable: true, comment: '密码' })
  password: string | null;

  @Column({ length: 64, nullable: true, comment: '昵称' })
  nickname: string | null;

  @Column({ length: 64, nullable: true, comment: '头像' })
  avatar: string | null;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
