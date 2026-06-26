import type { AuthResult, LoginForm } from '@/types/auth';
import { request } from '@/network/request';

/** 用户登录 */
export function loginApi(data: LoginForm) {
  return request.post<AuthResult>('/auth/login', data);
}
