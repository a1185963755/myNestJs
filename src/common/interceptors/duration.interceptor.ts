import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * 单接口耗时日志。
 *
 * 之前用 console.log，且通过 @UseInterceptors 手动挂在 UsersController 上；
 * 现在全局的 RequestLogInterceptor 已经记录了耗时，这里只保留 Logger 实现，
 * 供需要单独观察的接口按需挂载。
 */
@Injectable()
export class DurationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DurationInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const handler = next.handle();
    return handler.pipe(
      tap(() => {
        const { method, url } = context.switchToHttp().getRequest();
        this.logger.debug(`${method} ${url} 用时 ${Date.now() - start}ms`);
      }),
    );
  }
}
