# Spec: 登录功能

## 1. Context
- **所属模块**: `src/modules/auth/`
- **关联需求**: 无
- **前置条件**: 无，未创建数据库表，未创建ORM

## 2. Goal

实现登录功能，支持用户输入**邮箱**和**密码**，进行登录。登录成功后，返回用户信息和Token.

## 3. Data Schema

1. 管理员用户数据结构
```typescript
@Entity("sys_user")
export class SysUserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 64, unique: true, comment: '邮箱' })
    mail: string;
    @Column({ length: 64, nullable: true, comment: '昵称' })
    nickname: string | null;
    @Column({ length: 64, nullable: true, comment: '密码' })
    password: string | null;
    @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
    createdAt: Date;
}
```

