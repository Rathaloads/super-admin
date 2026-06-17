import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const body = exception.getResponse() as
      | { code?: number; message?: string | string[] }
      | string;

    const message =
      typeof body === 'string'
        ? body
        : Array.isArray(body.message)
          ? body.message.join(', ')
          : (body.message ?? 'Internal Server Error');

    const code = typeof body === 'object' ? (body.code ?? status) : status;

    // 5xx 记 error，其余记 warn（含业务异常 BusinessException 返回 200 的情况）
    const logMeta = {
      method: request.method,
      url: request.originalUrl,
      status,
      code,
      ip: request.ip,
    };

    if (status >= 500) {
      this.logger.error(message, exception.stack, logMeta);
    } else {
      this.logger.warn(message, logMeta);
    }

    response.status(status).json({
      Code: code,
      Message: message,
      Data: null,
    });
  }
}
