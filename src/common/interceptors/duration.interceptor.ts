import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DurationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const input = Date.now();
    const handler = next.handle();
    return handler.pipe(
      tap(() => {
        console.log(`用时${Date.now() - input}ms`);
      }),
    );
  }
}
