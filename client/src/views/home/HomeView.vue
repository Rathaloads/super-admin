<template>
  <div class="page-shell home-view">
    <div class="page-bg" aria-hidden="true">
      <div class="page-bg-orb page-bg-orb--blue" />
      <div class="page-bg-orb page-bg-orb--violet" />
      <div class="page-bg-orb page-bg-orb--mint" />
    </div>

    <div class="page-content">
      <header class="home-header">
        <div>
          <p class="home-greeting">{{ greeting }}</p>
          <h2 class="home-title">工作台概览</h2>
        </div>
        <p class="home-date">{{ todayLabel }}</p>
      </header>

      <!-- 统计卡片 -->
      <section class="stats-grid">
        <article
          v-for="stat in stats"
          :key="stat.key"
          class="glass-card stat-card"
          :style="{ '--accent': stat.accent }"
        >
          <div class="stat-card__header">
            <div class="stat-card__icon">
              <el-icon :size="20">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <span class="stat-card__trend" :class="stat.trend > 0 ? 'is-up' : 'is-down'">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
          </div>
          <p class="stat-card__label">{{ stat.label }}</p>
          <p class="stat-card__value">{{ stat.value }}</p>
          <div v-if="stat.progress !== undefined" class="stat-card__progress">
            <div class="stat-card__progress-track">
              <div
                class="stat-card__progress-bar"
                :style="{ width: `${stat.progress}%` }"
              />
            </div>
            <span class="stat-card__progress-text">目标完成 {{ stat.progress }}%</span>
          </div>
          <p v-else class="stat-card__hint">{{ stat.hint }}</p>
        </article>
      </section>

      <!-- 下方面板 -->
      <section class="panels-grid">
        <!-- TODO 面板 -->
        <article class="glass-card todo-panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">待办事项</h3>
              <p class="panel-subtitle">{{ todoSummary }}</p>
            </div>
            <div class="todo-progress-ring" :style="{ '--pct': todoProgress }">
              <svg viewBox="0 0 36 36">
                <circle class="ring-bg" cx="18" cy="18" r="15.5" />
                <circle class="ring-fill" cx="18" cy="18" r="15.5" />
              </svg>
              <span class="ring-label">{{ todoProgress }}%</span>
            </div>
          </div>

          <form class="todo-form" @submit.prevent="handleAddTodo">
            <input
              v-model="newTodoText"
              class="todo-input"
              type="text"
              placeholder="添加一条新待办…"
              maxlength="80"
            />
            <button class="glass-btn glass-btn--primary todo-add-btn" type="submit" :disabled="!newTodoText.trim()">
              添加
            </button>
          </form>

          <ul class="todo-list">
            <li
              v-for="item in todos"
              :key="item.id"
              class="todo-item"
              :class="{ 'is-done': item.done }"
            >
              <button
                class="todo-check"
                type="button"
                :aria-label="item.done ? '标记为未完成' : '标记为完成'"
                @click="toggleTodo(item.id)"
              >
                <span class="todo-check__dot" />
              </button>
              <span class="todo-text">{{ item.text }}</span>
              <button
                class="todo-remove"
                type="button"
                aria-label="删除"
                @click="removeTodo(item.id)"
              >
                <el-icon :size="14"><Close /></el-icon>
              </button>
            </li>
            <li v-if="todos.length === 0" class="todo-empty">暂无待办，添加一条开始今天的工作吧</li>
          </ul>
        </article>

        <!-- 系统状态面板 -->
        <article class="glass-card status-panel">
          <div class="panel-header">
            <div>
              <h3 class="panel-title">系统状态</h3>
              <p class="panel-subtitle">各模块运行概况</p>
            </div>
            <span class="status-badge">运行正常</span>
          </div>

          <ul class="status-list">
            <li v-for="item in systemStatus" :key="item.name" class="status-item">
              <div class="status-item__top">
                <span class="status-item__name">{{ item.name }}</span>
                <span class="status-item__value">{{ item.value }}%</span>
              </div>
              <div class="status-item__track">
                <div
                  class="status-item__bar"
                  :style="{ width: `${item.value}%`, '--bar-color': item.color }"
                />
              </div>
            </li>
          </ul>

          <div class="quick-actions">
            <button
              v-for="action in quickActions"
              :key="action.label"
              class="glass-btn glass-btn--ghost quick-action-btn"
              type="button"
              @click="action.onClick"
            >
              <el-icon :size="16"><component :is="action.icon" /></el-icon>
              {{ action.label }}
            </button>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Close,
  Coin,
  DataLine,
  Document,
  Plus,
  TrendCharts,
  Wallet,
} from '@element-plus/icons-vue';

interface StatItem {
  key: string;
  label: string;
  value: string;
  hint?: string;
  trend: number;
  progress?: number;
  accent: string;
  icon: typeof Wallet;
}

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

interface SystemStatusItem {
  name: string;
  value: number;
  color: string;
}

const router = useRouter();

const stats: StatItem[] = [
  {
    key: 'assets',
    label: '总资产',
    value: '¥ 128,430.50',
    hint: '较上月增长 ¥9,680',
    trend: 8.2,
    accent: '#6366f1',
    icon: Wallet,
  },
  {
    key: 'income',
    label: '本月收入',
    value: '¥ 24,560.00',
    trend: 12.5,
    progress: 78,
    accent: '#10b981',
    icon: TrendCharts,
  },
  {
    key: 'flow',
    label: '流水笔数',
    value: '156 笔',
    hint: '本周新增 42 笔',
    trend: 5.3,
    accent: '#0ea5e9',
    icon: DataLine,
  },
  {
    key: 'liability',
    label: '待还负债',
    value: '¥ 12,000.00',
    hint: '3 项即将到期',
    trend: -2.1,
    accent: '#f59e0b',
    icon: Coin,
  },
];

const systemStatus: SystemStatusItem[] = [
  { name: '数据库连接', value: 99, color: '#6366f1' },
  { name: '缓存命中率', value: 94, color: '#10b981' },
  { name: 'API 响应', value: 97, color: '#0ea5e9' },
  { name: '任务队列', value: 88, color: '#f59e0b' },
];

const todos = ref<TodoItem[]>([
  { id: 1, text: '核对本月银行流水', done: false },
  { id: 2, text: '更新负债还款计划', done: false },
  { id: 3, text: '整理季度财务报表', done: true },
]);

const newTodoText = ref('');
let nextTodoId = 4;

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
});

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
});

const todoProgress = computed(() => {
  if (todos.value.length === 0) return 0;
  const done = todos.value.filter((t) => t.done).length;
  return Math.round((done / todos.value.length) * 100);
});

const todoSummary = computed(() => {
  const active = todos.value.filter((t) => !t.done).length;
  return `还有 ${active} 项待处理`;
});

const quickActions = [
  {
    label: '记一笔流水',
    icon: Plus,
    onClick: () => router.push('/financial/found'),
  },
  {
    label: '查看负债',
    icon: Document,
    onClick: () => router.push('/financial/liabilities'),
  },
];

function handleAddTodo() {
  const text = newTodoText.value.trim();
  if (!text) return;
  todos.value.unshift({ id: nextTodoId++, text, done: false });
  newTodoText.value = '';
}

function toggleTodo(id: number) {
  const item = todos.value.find((t) => t.id === id);
  if (item) item.done = !item.done;
}

function removeTodo(id: number) {
  todos.value = todos.value.filter((t) => t.id !== id);
}
</script>

<style scoped lang="scss">
@use '@/styles/glass' as *;

.home-view {
  overflow-y: auto;
}

.home-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.home-greeting {
  margin: 0 0 4px;
  font-size: 13px;
  color: $color-text-secondary;
  letter-spacing: 0.02em;
}

.home-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: $color-text-primary;
  letter-spacing: -0.02em;
}

.home-date {
  margin: 0;
  font-size: 13px;
  color: $color-text-muted;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 16px;
    right: 16px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.45;
  }
}

.stat-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: $radius-control;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
}

.stat-card__trend {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;

  &.is-up {
    color: #059669;
    background: rgba(16, 185, 129, 0.1);
  }

  &.is-down {
    color: #d97706;
    background: rgba(245, 158, 11, 0.1);
  }
}

.stat-card__label {
  margin: 0 0 4px;
  font-size: 13px;
  color: $color-text-secondary;
}

.stat-card__value {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
  color: $color-text-primary;
  letter-spacing: -0.02em;
}

.stat-card__hint {
  margin: 0;
  font-size: 12px;
  color: $color-text-muted;
}

.stat-card__progress-track {
  @include progress-track;
}

.stat-card__progress-bar {
  @include progress-bar(var(--accent));
}

.stat-card__progress-text {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: $color-text-muted;
}

.panels-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.panel-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: $color-text-primary;
}

.panel-subtitle {
  margin: 0;
  font-size: 12px;
  color: $color-text-muted;
}

.todo-panel,
.status-panel {
  padding: 24px;
}

.todo-progress-ring {
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .ring-bg {
    fill: none;
    stroke: rgba(15, 23, 42, 0.06);
    stroke-width: 3;
  }

  .ring-fill {
    fill: none;
    stroke: $color-accent;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 97.4;
    stroke-dashoffset: calc(97.4 - (97.4 * var(--pct)) / 100);
    transition: stroke-dashoffset $duration-slow $fluent-ease;
  }

  .ring-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    color: $color-accent;
  }
}

.todo-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.todo-input {
  flex: 1;
  height: 38px;
  padding: 0 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: $radius-control;
  background: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  color: $color-text-primary;
  outline: none;
  transition:
    border-color $duration-fast $fluent-ease,
    box-shadow $duration-fast $fluent-ease;

  &::placeholder {
    color: $color-text-muted;
  }

  &:focus {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
}

.todo-add-btn {
  height: 38px;
}

.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: $radius-control;
  transition: background $duration-fast $fluent-ease;

  &:hover {
    background: rgba(255, 255, 255, 0.55);

    .todo-remove {
      opacity: 1;
    }
  }

  &.is-done .todo-text {
    color: $color-text-muted;
    text-decoration: line-through;
    text-decoration-color: rgba(148, 163, 184, 0.5);
  }

  &.is-done .todo-check__dot {
    background: $color-accent;
    border-color: $color-accent;
  }
}

.todo-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}

.todo-check__dot {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  background: transparent;
  transition:
    background $duration-normal $fluent-ease,
    border-color $duration-normal $fluent-ease;
}

.todo-text {
  flex: 1;
  font-size: 13px;
  color: #334155;
  transition: color $duration-normal $fluent-ease;
}

.todo-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: $color-text-muted;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity $duration-fast $fluent-ease,
    background $duration-fast $fluent-ease,
    color $duration-fast $fluent-ease;

  &:hover {
    background: rgba(239, 68, 68, 0.08);
    color: $color-danger;
  }
}

.todo-empty {
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: $color-text-muted;
}

.status-panel {
  display: flex;
  flex-direction: column;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.15);
}

.status-list {
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.status-item__top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.status-item__name {
  font-size: 13px;
  color: #475569;
}

.status-item__value {
  font-size: 12px;
  font-weight: 600;
  color: $color-text-secondary;
}

.status-item__track {
  @include progress-track;
}

.status-item__bar {
  @include progress-bar(var(--bar-color));
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.quick-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
</style>
