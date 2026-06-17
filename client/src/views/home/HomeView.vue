<script setup lang="ts">
import { ElMessage } from 'element-plus'
</script>

<template>
  <div class="home-view">
    <el-card shadow="never">
      <template #header>
        <span>欢迎使用 SuperAdmin</span>
      </template>
      <p class="home-desc">
        基于 Vue 3 + Element Plus 的后台管理系统，可在此添加你的管理工具与功能模块。
      </p>
      <el-button type="primary" @click="ElMessage.success('前端项目已初始化完成')">
        测试消息
      </el-button>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  @apply max-w-3xl;
}

.home-desc {
  @apply mb-4 text-gray-600 leading-relaxed;
}
</style>
