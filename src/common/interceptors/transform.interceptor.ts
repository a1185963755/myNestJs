import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
@Injectable()
export class TransformIntercepter implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
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
