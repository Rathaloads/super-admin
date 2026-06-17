<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

/** 当前页面标题，来自路由 meta */
const pageTitle = computed(() => (route.meta.title as string) ?? 'SuperAdmin')

/** 侧边栏菜单项 */
const menuItems = [
  { index: '/home', title: '首页', icon: HomeFilled },
]

/** 当前激活菜单 */
const activeMenu = computed(() => route.path)

/** 菜单点击跳转 */
function handleMenuSelect(index: string) {
  router.push(index)
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="layout-aside">
      <div class="layout-logo">SuperAdmin</div>
      <el-menu
        :default-active="activeMenu"
        class="layout-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶栏 -->
      <el-header class="layout-header">
        <h1 class="layout-title">{{ pageTitle }}</h1>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  @apply h-screen;
}

.layout-aside {
  @apply flex flex-col bg-white border-r border-gray-200;
}

.layout-logo {
  @apply flex items-center h-14 px-5 text-lg font-semibold text-gray-800 border-b border-gray-200;
}

.layout-menu {
  @apply flex-1 border-r-0;
}

.layout-header {
  @apply flex items-center h-14 px-6 bg-white border-b border-gray-200;
}

.layout-title {
  @apply m-0 text-lg font-medium text-gray-800;
}

.layout-main {
  @apply p-6;
}
</style>
