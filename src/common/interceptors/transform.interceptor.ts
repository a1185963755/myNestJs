import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { SKIP_GLOBAL_INTERCEPTOR } from '../decorators/skip-global.decorator';
@Injectable()
export class TransformIntercepter implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const skipInterceptor = this.reflector.get(
      SKIP_GLOBAL_INTERCEPTOR,
      context.getHandler(),
    );
    if (skipInterceptor) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        if (data === null) {
          return '';
        }
        return {
          code: 200,
          data,
          msg: '请求成功',
        };
      }),
    );
  }
}
