<template>
  <div class="login-page">
    <!-- 模糊视频背景 -->
    <video
      class="login-video"
      autoplay
      muted
      loop
      playsinline
      :src="LOGIN_BG_VIDEO"
    />

    <!-- 暗色遮罩，提升表单可读性 -->
    <div class="login-overlay" />

    <div class="login-content">
      <div class="login-card">
        <header class="login-header">
          <h1 class="login-title">SuperAdmin</h1>
          <p class="login-subtitle">登录你的管理账户</p>
        </header>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="login-form"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="mail">
            <el-input
              v-model="form.mail"
              placeholder="邮箱"
              size="large"
              clearable
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
              :prefix-icon="Lock"
              @keyup.enter="handleSubmit"
            />
          </el-form-item>

          <el-button
            class="login-button"
            type="primary"
            size="large"
            :loading="loading"
            @click="handleSubmit"
          >
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, Message } from '@element-plus/icons-vue'
import { LOGIN_BG_VIDEO } from '@/constants/auth'
import { ApiBusinessError } from '@/network/request-error'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<LoginForm>({
  mail: '',
  password: '',
})

const rules: FormRules<LoginForm> = {
  mail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
}

async function handleSubmit() {
  if (!formRef.value || loading.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await authStore.login(form)
    ElMessage.success('登录成功')
    await router.replace('/home')
  } catch (error) {
    const message =
      error instanceof ApiBusinessError ? error.message : '登录失败，请稍后重试'
    ElMessage.error(message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  @apply relative min-h-screen overflow-hidden;
}

.login-video {
  @apply absolute inset-0 h-full w-full object-cover;
  filter: blur(12px);
  transform: scale(1.05);
}

.login-overlay {
  @apply absolute inset-0;
  background: linear-gradient(
    135deg,
    rgb(15 23 42 / 45%) 0%,
    rgb(30 41 59 / 35%) 50%,
    rgb(15 23 42 / 50%) 100%
  );
}

.login-content {
  @apply relative z-10 flex min-h-screen items-center justify-center px-4 py-10;
}

.login-card {
  @apply w-full max-w-md rounded-2xl border border-white/20 p-8 shadow-2xl;
  background: rgb(255 255 255 / 12%);
  backdrop-filter: blur(20px);
}

.login-header {
  @apply mb-8 text-center;
}

.login-title {
  @apply m-0 text-3xl font-semibold tracking-wide text-white;
}

.login-subtitle {
  @apply mt-2 text-sm text-white/70;
}

.login-form {
  :deep(.el-form-item) {
    @apply mb-5;
  }

  :deep(.el-input__wrapper) {
    @apply rounded-xl border-0 bg-white/90 shadow-none;
  }
}

.login-button {
  @apply mt-2 w-full rounded-xl font-medium;
}
</style>
