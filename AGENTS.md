# SuperAdmin-PC

## 项目基础信息

- 项目介绍: 
基于 Vue 3 和 NestJS 的后台管理系统, 主要提供我个人来使用，将平时一些想要开发的管理工具或者想要的功能，可以在这个项目中进行开发。

- 核心技术栈: 
Vue3 作为前端开发，NestJS 作为后端开发，MySQL 作为数据库，Redis 作为缓存。

- 核心约束: 
1. 所有文档必须使用中文编写
2. 所有代码必须使用中文注释
3. 遵循 Vue 3 和 NestJS 的开发规范


## 项目目录结构说明

- client: 前端代码目录
- backend-service: 后端代码目录
- docs: 项目文档目录
- scripts: 项目脚本目录
- sql: 项目数据库表结构以及存储过程等目录

## 技术栈说明

### 前端技术栈

| 层级 | 选型 | 说明 |
| ---- | ---- | ---- |
| 框架 | Vue 3 + Composition API | `<script setup lang="ts">` |
| 状态管理 | Pinia | Setup Store 风格（`defineStore` + `ref`） |
| 构建工具 | Vite | 开发服务器与生产构建 |
| 语言 | TypeScript | 严格模式，构建前执行 `vue-tsc` |
| UI 组件库 | Element Plus | 全局注册，中文 locale |
| 图标 | @element-plus/icons-vue | 按需从包中导入 |
| 样式 | Tailwind CSS 3 + SCSS | 布局/间距用 Tailwind，组件内样式用 scoped SCSS |
| 路由 | Vue Router 4 | **Hash 模式**（`createWebHashHistory`） |


### 后端技术栈

| 层级 | 选型 | 说明 |
| ---- | ---- | ---- |
| 框架 | NestJS | 基于 Node.js 的框架 |
| 数据库 | MySQL 8.0 | 关系型数据库 |
| 缓存 | Redis | 缓存数据库 |

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

```


## 前端架构约定

### 路由

- 使用 **Hash 路由**，访问路径形如 `/#/xxx`，无需服务端配置 fallback。
- 页面级路由挂在 `MainLayout` 的 `children` 下。
- 页面标题通过路由 `meta.title` 传递，由 `MainLayout` 读取展示。
- 路由组件使用动态 `import()` 懒加载。
- 新增功能模块时：在 `views/<模块>/` 添加页面，在 `router/index.ts` 注册路由，在 `MainLayout.vue` 侧边栏添加菜单项。

### 状态管理

- 按业务模块拆分 Store，文件放在 `src/stores/`，命名 `useXxxStore`。
- 使用 Pinia Setup Store：`defineStore('id', () => { ... })`。
- 领域类型定义在 `src/types/`，Store 与组件通过 `@/types/*` 引用。

### 组件与样式

- 页面组件放 `src/views/<模块>/`，通用 UI 放 `src/components/`。
- 单文件组件统一使用 `<script setup lang="ts">`。
- Element Plus 负责表单、表格、对话框等交互组件。
- Tailwind 用于布局类（`flex`、`gap`、`bg-*` 等）；组件私有样式写在 `<style scoped lang="scss">` 中，可用 `@apply` 复用 Tailwind 工具类。
- 全局样式入口：`src/styles/index.scss`，在 `main.ts` 中引入。

### 路径别名

- `@` 映射到 `src/`，示例：`import { useXxxStore } from '@/stores/xxx'`。

### 后端架构约定

.......待补充

## 功能模块

.......待补充

## 开发规范详细说明（面向 Agent）

### 前端开发规范详细说明

1. **保持技术栈一致**：不引入未经讨论的新框架；新依赖优先选与 Vue 3 生态兼容的库。
2. **最小改动原则**：只修改与任务相关的文件，不顺带重构无关代码。
3. **类型先行**：新增业务实体先在 `src/types/` 定义接口，再在 Store 和视图中使用。
4. **模块内聚**：新功能按 `types` → `stores` → `views` → `router` → `layout 菜单` 顺序扩展。
5. **中文界面**：用户可见文案使用简体中文；Element Plus 已配置 `zh-cn` locale。
6. **PC 优先**：布局默认适配桌面端宽度，侧边栏 + 主内容区结构。
7. **构建须通过**：提交前确保 `pnpm build` 无 TypeScript 与构建错误。

### 后端开发规范详细说明

.......待补充
