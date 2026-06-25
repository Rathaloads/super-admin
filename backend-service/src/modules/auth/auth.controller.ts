import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SafeUser } from './interfaces/safe-user.interface';

/** 携带 JWT 校验后用户信息的请求 */
interface AuthenticatedRequest extends Request {
  user: SafeUser;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /** 用户注册 */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    this.logger.log(`用户发起注册请求: ${dto.mail}`);
    return this.authService.register(dto);
  }

  /** 用户登录 */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    this.logger.log(`用户发起登录请求: ${dto.mail}`);
    return this.authService.login(dto);
  }

  /** 获取当前登录用户信息（需携带 Bearer Token） */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
