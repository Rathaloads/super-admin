# Spec: <功能名称>

## 1. Context（上下文）
<!-- 告诉 Agent 这个功能在整体架构中的位置 -->
- **所属模块**: `apps/api/src/modules/<module-name>/`
- **关联需求**: （如果有依赖其他功能）
- **前置条件**: （数据库已有某表 / 某配置已存在）

## 2. Goal（目标）
<!-- 一句话说清要干什么，避免歧义 -->
实现 `<功能>` 接口，支持 `<具体操作>`，返回 `<预期结果>`。

## 3. Data Schema（数据结构 - 最重要）

### 3.1 Database / Entity
```sql

- 如果是SQL
CREATE TABLE xxx (...);

```

```typescript
// 如果是 TypeORM Entity (backend-service/src/modules/xxx/entities/xxx.entity.ts)
@Entity('xxx')
export class Xxx {
    @PrimaryGeneratedColumn()
    id: number;
    ...
}
```

### 3.2 DTOs
<!-- 所有出入参的定义 -->
```typescript
// 如果是 DTO (backend-service/src/modules/xxx/dtos/xxx.dto.ts)
export class CreateXxxDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(64)
    username: string;
    ...
}
```

## 4. API Endpoints（接口契约）

这是 Agent 生成 Controller 的依据

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| POST | `/xxx` | 创建 | `CreateXxxDto` | `XxxEntity` |
| GET | `/xxx/:id` | 查询 | - | `XxxEntity` |

### 4.1 详细行为说明
- **POST `/xxx`**:
  - 校验 DTO
  - 检查重名（name 唯一）
  - 成功后返回 201
- **GET `/xxx/:id`**:
  - 找不到返回 404
  - 权限检查：只能查自己的

## 5. Business Logic（业务逻辑）
<!-- 写在 Service 里的具体逻辑 -->

在 `XxxService` 中实现：

1. `create()`: 创建记录，处理并发冲突
2. `findOne()`: 查询，包含关联数据（relations）
3. `update()`: 只允许修改特定字段

## 7. Tests（验收标准）
<!-- Agent 生成测试的依据，越具体越好 -->

### Unit Tests
- [ ] `should create xxx successfully`
- [ ] `should throw error when name duplicate`
- [ ] `should hash password before save`

### Integration Tests
- [ ] `POST /xxx` returns 201 with valid data
- [ ] `POST /xxx` returns 409 when duplicate name
- [ ] `GET /xxx/invalid-id` returns 404

## 8. Frontend Tasks (如果是全栈需求)
<!-- 如果是 Vue3 部分 -->

### Components
- 新建 `UserProfile.vue` in `apps/web/src/components/user/`
- Props: `userId: string`
- Emits: `updated`, `cancel`

### Store (Pinia)
- `useUserStore` actions: `fetchUser()`, `updateUser()`

## 9. Implementation Checklist（执行清单）
<!-- 让 Agent 一步步执行，防止漏项 -->

- [ ] 1. 创建 Entity 文件
- [ ] 2. 创建 DTOs
- [ ] 3. 创建 Service（含方法签名）
- [ ] 4. 创建 Controller（只做转发）
- [ ] 5. 注册 Module
- [ ] 6. 写 Unit Tests
- [ ] 7. 写 Integration Tests
- [ ] 8. 更新 Swagger 注释