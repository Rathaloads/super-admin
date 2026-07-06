# SuperAdmin-PC

## 项目概览

一个全栈的Web端个人管理台项目，前端基于Vue， 后端基于NestJS，数据库使用MySQL，缓存使用Redis。

- **前端**: 代码在client目录下, 基于Vue3 + Vite + Composition API + Pinia + Element Plus + Vue Router + Tailwind CSS + TypeScript + Scss
- **后端**: 代码在backend-service目录下, 基于NestJS + TypeORM + MySQL + Redis + Winston(日志)
- **数据库**: MySQL, 使用TypeORM作为ORM框架
- **缓存**: Redis, 使用ioredis作为缓存客户端
- **包管理**: 使用pnpm作为包管理工具
- **运行时**: Node.js >= 20



## 项目核心约束: 

1. 所有文档必须使用中文编写
2. 所有代码必须使用中文注释
3. 遵循 Vue 3 和 NestJS 的开发规范


## 项目目录结构说明

- client: 前端代码目录
- backend-service: 后端代码目录
- docs: 项目文档目录
- scripts: 项目脚本目录
- sql: 项目数据库表
- specs: 项目需求文档目录

## 常用命令

### 前端常用命令

```bash
pnpm install   # 安装依赖
pnpm dev       # 启动开发服务器（默认 http://localhost:5173）
pnpm build     # 类型检查 + 生产构建
pnpm preview   # 预览构建产物
```

### 后端常用命令

```bash
pnpm install   # 安装依赖
pnpm dev       # 启动开发服务器（默认 http://localhost:3000）
pnpm build     # 生产构建
```

## 项目开发规范

### 前端代码规范

  - 所有新组件 **必须用 `<script setup lang="ts">`**，禁止 Options API、禁止裸 `<script>` 写 setup()。
  - 每个 `.vue` 文件结构顺序：
    1. `<template>`（视图）
    2. `<script setup lang="ts">` (逻辑)
    3. `<style lang="scss" scoped>`（样式，能 scoped 就 scoped）
  - 组件文件命名：**`PascalCase.vue`**（如 `UserProfileCard.vue`），禁止 kebab-case 文件名。
  - 一个 SFC **只做一件事**：如果你的 `<script setup>` 超过 ~150 行（不含类型），先拆 composable / 拆子组件，再扩容。

  #### Composable 规范

  - 可复用的状态/逻辑抽成 `composables/`，命名 `useXxx.ts`（驼峰，带 use 前缀）。
  - composable **不应**直接耦合具体组件模板，返回值应该是数据和方法。
  - composable 里有副作用（listener / timer / subscription）→ **必须在 unmounted 清理**：`onUnmounted(() => clearInterval(timer))` 之类。

  #### 目录约定(src/)

  | 路径 | 职责 |
  |------|------|
  | `components/` | 通用/基础 UI 组件 |
  | `views/`  | 页面级组件（路由入口） |
  | `composables/` | 可复用的状态/逻辑 |
  | `stores/` | Pinia store |
  | `utils/` | 纯工具函数（无副作用、可 tree-shake） |
  | `api/` | 按模块拆分接口：`api/user.ts` / `api/order.ts`，统一走封装好的 request |
  | `types/` | 共享 TS 类型 |
  | `router/` | 路由定义 |
  | `styles/` | 全局 tokens、variables、reset（谨慎扩张）；**玻璃风格见 `glass.scss`** |

  #### UI 设计风格（Acrylic Fluent）

  所有新页面必须遵循 **亚克力玻璃 + Fluent 轻动效** 风格，详见 `client/AGENTS.md` 与 `.cursor/rules/frontend-ui-design.mdc`，参考实现 `client/src/views/home/HomeView.vue`。


### 后端规范

  #### 1. 目录结构与职责绑定 (Directory Discipline)

  严格遵循以下结构，AI 在创建新功能时必须按此映射：

  - `src/common/`: **全局共享资源** (非业务代码)
  - `dto/`: 全局通用 DTO (如 `response.dto.ts`, `pagination.dto.ts`)。
  - `exceptions/`: 自定义业务异常基类 (如 `business.exception.ts`)。
  - `filters/`: 全局异常过滤器 (如 `http-exception.filter.ts`)。
  - `interceptors/`: 全局拦截器 (如日志、响应包装)。
  - `middleware/`: 全局中间件。
  - `logger/`: 日志模块封装。
  - `utils/`: 纯工具函数，无依赖注入。

  - `src/config/`: 配置文件 (如 `configuration.ts`)。
  - `src/database/`: 数据库连接、TypeORM 配置封装。
  - `src/modules/`: **业务功能域** (Feature Modules)
  - 每个子文件夹（如 `auth`）是一个独立的功能模块。
  - **禁止**在 `modules` 下创建 `controllers`, `services` 这种按技术分层的文件夹，必须按业务聚合。


  #### 2. 命名规范 (Naming Conventions)

  - **文件夹**: 小写蛇形命名 (snake_case) 或 短横线命名 (kebab-case) -> `user-profiles`。
  - **文件**: PascalCase (大驼峰) -> `UserProfile.controller.ts`。
  - **类名**: 与文件名一致，后缀明确 -> `UserProfileController`。

  #### 3. 业务模块内部规范 (Naming Conventions)
  **⚠️ 禁令 (Caveats):**
  - **禁止**在 `modules/*` 下再创建名为 `common` 的文件夹来存放该模块的私有 DTO 或常量。私有的东西直接放在该模块根目录下，或者使用 `index.ts` 导出。
  - **禁止** Controller 中出现 SQL 查询语句或复杂的业务逻辑判断，必须委派给 Service。
  - **禁止** Service 中出现 `res.status(200).json(...)` 这种 HTTP 响应逻辑。
