import { Controller, Get, Logger, Post } from '@nestjs/common';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Controller()
export class AuthController {
  /** 全局 Winston 已在 main.ts 注册，此处直接 new Logger 即可，无需注入 */
  private readonly logger = new Logger(AuthController.name);

  @Get('login')
  login() {
    this.logger.log('用户发起登录请求');
    this.logger.debug('登录接口参数校验通过');
    throw new BusinessException(10000, 'Login failed');
  }

  @Get('register')
  register() {
    this.logger.log('用户发起注册请求');
    return "Register success";
  }
}
