/** 对外返回的用户信息（不含密码） */
export interface SafeUser {
  id: number;
  mail: string;
  nickname: string | null;
  avatar: string | null;
  createdAt: Date;
}
