/** 登录用户信息 */
export interface AuthUser {
  id: number;
  mail: string;
  nickname: string | null;
  avatar: string | null;
  createdAt: string;
}

/** 登录 / 注册成功响应 */
export interface AuthResult {
  token: string;
  user: AuthUser;
}

/** 登录表单 */
export interface LoginForm {
  mail: string;
  password: string;
}
