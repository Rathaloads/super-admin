import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/** 用户登录请求体 */
export class LoginDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @MaxLength(64, { message: '邮箱长度不能超过 64 个字符' })
  mail: string;

  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于 6 个字符' })
  @MaxLength(64, { message: '密码长度不能超过 64 个字符' })
  password: string;
}
