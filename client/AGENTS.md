# Client 前端规范

本目录遵循根目录 `AGENTS.md` 的通用前端规范，并额外遵守 **Acrylic Fluent** 视觉设计语言。

## UI 设计风格（必须遵循）

> 详细规则见 `.cursor/rules/frontend-ui-design.mdc`  
> 参考实现：`src/views/home/HomeView.vue`  
> 共享样式：`src/styles/glass.scss`

### 视觉关键词

柔和渐变背景 · 亚克力玻璃卡片 · 清晰圆角 · 细腻高光描边 · Fluent 轻量动效

### 页面结构模板

```vue
<template>
  <div class="page-view">
    <div class="page-bg" aria-hidden="true">
      <div class="page-bg-orb page-bg-orb--blue" />
      <!-- 可选更多光斑 -->
    </div>
    <div class="page-content">
      <article class="glass-card">...</article>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/glass' as *;
/* 页面专属样式 */
</style>
```

### 设计 Token

| Token | 值 |
|-------|-----|
| 缓动曲线 | `cubic-bezier(0.33, 0, 0.67, 1)` |
| 快速动效 | 150ms |
| 普通过渡 | 220ms |
| 进度条过渡 | 280ms |
| 卡片圆角 | 16px |
| 控件圆角 | 10px |
| 主强调色 | `#6366f1` |

### 交互原则

1. 卡片悬停：上浮 2px + 阴影加深
2. 按钮悬停：颜色加深 + 阴影增强，不位移
3. 进度/状态：宽度或渐变平滑过渡
4. 禁止夸张弹跳、厚重拟物、高饱和纯色背景

### 布局组件

| 组件 | 路径 | 用途 |
|------|------|------|
| `GlassPageShell` | `components/layout/GlassPageShell.vue` | 页面渐变背景 + 标题区 |
| `GlassListPanel` | `components/layout/GlassListPanel.vue` | 列表页工具栏/表格/分页容器 |

列表类页面优先组合以上两个组件，样式类使用 `glass.scss` 中的全局 Class。
