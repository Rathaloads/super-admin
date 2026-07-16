<template>
  <el-container class="layout-container">
    <div class="layout-bg" aria-hidden="true" />

    <!-- 亚克力侧边栏 -->
    <el-aside width="220px" class="layout-aside">
      <div class="layout-logo">
        <span class="layout-logo__dot" />
        SuperAdmin
      </div>
      <el-menu
        :default-active="activeMenu"
        class="layout-menu"
        @select="handleMenuSelect"
      >
        <template v-for="item in menuItems" :key="item.key">
          <el-sub-menu v-if="item.childrens?.length" :index="item.index">
            <template #title>
              <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.childrens"
              :key="child.key"
              :index="child.index"
            >
              <el-icon v-if="child.icon"><component :is="child.icon" /></el-icon>
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.index">
            <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container class="layout-main-wrap">
      <el-header class="layout-header">
        <h1 class="layout-title">{{ pageTitle }}</h1>
        <div class="layout-header__actions">
          <span class="layout-user">{{ userLabel }}</span>
          <button class="layout-logout" type="button" @click="handleLogout">退出</button>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HomeFilled, Wallet, List, CreditCard } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';

interface MenuChild {
  index: string;
  title: string;
  key: string;
  icon: Component | null;
}

interface MenuItem {
  index: string;
  title: string;
  key: string;
  icon: Component | null;
  childrens?: MenuChild[];
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const pageTitle = computed(() => (route.meta.title as string) ?? 'SuperAdmin');

const userLabel = computed(() => authStore.user?.nickname || authStore.user?.mail || '用户');

const menuItems: MenuItem[] = [
  { index: '/home', title: '首页', key: 'home', icon: HomeFilled },
  // {
  //   index: '/financial',
  //   title: '财务管理',
  //   key: 'financial',
  //   icon: Wallet,
  //   childrens: [
  //     { index: '/financial/found', title: '流水管理', key: 'found', icon: List },
  //     { index: '/financial/liabilities', title: '负债管理', key: 'liabilities', icon: CreditCard },
  //   ],
  // },
  {
    index: '/bookkeeping',
    title: 'Bookkeeping',
    key: 'bookkeeping',
    icon: Wallet,
    childrens: [
      { index: '/bookkeeping/book', title: '账本', key: 'book', icon: List },
    ],
  },
];

const activeMenu = computed(() => route.path);

function handleMenuSelect(index: string) {
  router.push(index);
}

function handleLogout() {
  authStore.logout();
  router.replace('/login');
}
</script>

<style scoped lang="scss">
@use '@/styles/glass' as *;

.layout-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.layout-bg {
  position: absolute;
  inset: 0;
  @include page-gradient-bg;
  pointer-events: none;
}

.layout-aside {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border-right: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 2px 0 16px rgba(15, 23, 42, 0.04);
}

.layout-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 20px;
  font-size: 17px;
  font-weight: 600;
  color: $color-text-primary;
  letter-spacing: -0.02em;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.layout-logo__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
}

.layout-menu {
  flex: 1;
  border-right: none;
  background: transparent;
  padding: 8px;
  --el-menu-bg-color: transparent;
  --el-menu-hover-bg-color: rgba(99, 102, 241, 0.08);
  --el-menu-active-color: #{$color-accent};
  --el-menu-text-color: #{$color-text-secondary};
  --el-menu-item-height: 42px;
  --el-menu-sub-item-height: 40px;
  --el-menu-border-color: transparent;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    border-radius: $radius-control;
    margin-bottom: 2px;
    font-size: 13px;
    transition: background $duration-fast $fluent-ease;
  }

  :deep(.el-menu-item.is-active) {
    background: rgba(99, 102, 241, 0.1);
    font-weight: 500;
  }
}

.layout-main-wrap {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
}

.layout-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: $color-text-primary;
}

.layout-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.layout-user {
  font-size: 13px;
  color: $color-text-secondary;
}

.layout-logout {
  @include glass-ghost-btn;
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
}

.layout-main {
  padding: 12px;
  height: calc(100vh - 56px);
  overflow: hidden;
}
</style>
