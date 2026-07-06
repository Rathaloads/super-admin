<template>
  <div class="login-page">
    <video class="login-video" autoplay muted loop playsinline :src="LOGIN_BG_VIDEO" />
    <div class="login-overlay" />

    <div class="login-content">
      <div class="login-card glass-card">
        <header class="login-header">
          <h1 class="login-title">SuperAdmin</h1>
          <p class="login-subtitle">登录你的管理账户</p>
        </header>

        <el-form ref="formRef" :model="form" :rules="rules" class="login-form" @submit.prevent="handleSubmit">
          <el-form-item prop="mail">
            <el-input v-model="form.mail" placeholder="邮箱" size="large" clearable :prefix-icon="Message" />
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

          <button class="login-button glass-btn glass-btn--primary" type="button" :disabled="loading" @click="handleSubmit">
            {{ loading ? '登录中…' : '登录' }}
          </button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Lock, Message } from '@element-plus/icons-vue';
import { LOGIN_BG_VIDEO } from '@/constants/auth';
import { ApiBusinessError } from '@/network/request-error';
import { useAuthStore } from '@/stores/auth';
import type { LoginForm } from '@/types/auth';

const router = useRouter();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive<LoginForm>({
  mail: '',
  password: '',
});

const rules: FormRules<LoginForm> = {
  mail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
};

async function handleSubmit() {
  if (!formRef.value || loading.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  try {
    await authStore.login(form);
    ElMessage.success('登录成功');
    await router.replace('/home');
  } catch (error) {
    const message = error instanceof ApiBusinessError ? error.message : '登录失败，请稍后重试';
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/glass' as *;

.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.login-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(12px);
  transform: scale(1.05);
}

.login-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgb(15 23 42 / 45%) 0%, rgb(30 41 59 / 35%) 50%, rgb(15 23 42 / 50%) 100%);
}

.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 36px 32px;
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;

  &:hover {
    transform: translateY(-2px);
  }
}

.login-header {
  margin-bottom: 32px;
  text-align: center;
}

.login-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.02em;
}

.login-subtitle {
  margin: 8px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-input__wrapper) {
    border-radius: $radius-control;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: none;
    transition: box-shadow $duration-fast $fluent-ease;

    &.is-focus {
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
  }
}

.login-button {
  width: 100%;
  height: 44px;
  margin-top: 8px;
}
</style>
