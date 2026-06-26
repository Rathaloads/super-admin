import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { AuthUser, LoginForm } from '@/types/auth';
import { loginApi } from '@/api/auth';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/constants/auth';

/** 从 localStorage 读取已持久化的用户信息 */
function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));
  const user = ref<AuthUser | null>(readStoredUser());

  const isLoggedIn = computed(() => Boolean(token.value));

  /** 持久化登录态 */
  function persistAuth(nextToken: string, nextUser: AuthUser) {
    token.value = nextToken;
    user.value = nextUser;
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  }

  /** 登录 */
  async function login(form: LoginForm) {
    const { data: {Data} } = await loginApi(form);
    persistAuth(Data.token, Data.user);
    return Data;
  }

  /** 退出登录 */
  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
  };
});
