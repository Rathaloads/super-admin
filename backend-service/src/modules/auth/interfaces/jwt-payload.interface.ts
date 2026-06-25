/** JWT 载荷 */
export interface JwtPayload {
  /** 用户 ID */
  sub: number;
  /** 邮箱 */
  mail: string;
}
