import { Controller, Get, Logger, Query } from '@nestjs/common';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * 登录示例：MySQL 查用户 + Redis 缓存用户信息与 Token
   * GET /login?username=admin
   */
  @Get('login')
  async login(@Query('username') username = 'admin') {
    this.logger.log(`用户发起登录请求: ${username}`);

    const { user, fromCache } =
      await this.authService.findUserByUsername(username);
    if (!user) {
      throw new BusinessException(10001, '用户不存在');
    }

    const token = await this.authService.createLoginToken(username);

    return {
      token,
      user,
      fromCache,
      message: fromCache ? '用户信息来自 Redis 缓存' : '用户信息来自 MySQL',
    };
  }

  /**
   * 查询 Redis 中缓存的登录 Token
   * GET /token?username=admin
   */
  @Get('token')
  async getToken(@Query('username') username = 'admin') {
    const token = await this.authService.getLoginToken(username);
    if (!token) {
      throw new BusinessException(10002, 'Token 不存在或已过期');
    }
    return { username, token };
  }

  @Get('register')
  register() {
    this.logger.log('用户发起注册请求');
    return 'Register success';
  }
}
