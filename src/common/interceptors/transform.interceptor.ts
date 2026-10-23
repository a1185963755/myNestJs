import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { SKIP_GLOBAL_INTERCEPTOR } from '../decorators/skip-global.decorator';
import type { TimedRequest } from '../types/http.types';

@Injectable()
export class TransformIntercepter implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const skipInterceptor = this.reflector.getAllAndOverride<boolean>(
      SKIP_GLOBAL_INTERCEPTOR,
      [context.getHandler(), context.getClass()],
    );
    if (skipInterceptor) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return '';
        }
        const startTime = context
          .switchToHttp()
          .getRequest<TimedRequest>().startTime;
        const duration =
          typeof startTime === 'number' ? Date.now() - startTime : undefined;
        return {
          code: 200,
          data,
          msg: '请求成功',
          duration,
        };
      }),
    );
  }
}
