import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Readable } from 'stream';
import { ResponseDto } from '../dto/response.dto';

/** 拦截器输出：JSON 包装为 ResponseDto，二进制/流式响应原样透传 */
type TransformResult<T> = ResponseDto<T> | Buffer | Readable;

export class TransformInterceptor<T>
  implements NestInterceptor<T, TransformResult<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<TransformResult<T>> {
    return next.handle().pipe(
      map((data): TransformResult<T> => {
        if (Buffer.isBuffer(data) || data instanceof Readable) {
          return data;
        }
        return new ResponseDto(200, 'Success', data);
      }),
    );
  }
}
