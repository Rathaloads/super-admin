import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/** 用户注册请求体 */
export class RegisterDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @MaxLength(64, { message: '邮箱长度不能超过 64 个字符' })
  mail: string;

  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于 6 个字符' })
  @MaxLength(64, { message: '密码长度不能超过 64 个字符' })
  password: string;

  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @MaxLength(64, { message: '昵称长度不能超过 64 个字符' })
  nickname?: string;
}
