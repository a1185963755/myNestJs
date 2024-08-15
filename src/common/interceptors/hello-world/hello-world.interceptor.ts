import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HelloWorldInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const input = Date.now();
    const handler = next.handle();
    return handler.pipe(
      tap(() => {
        console.log(`${Date.now() - input}ms`);
      }),
    );
  }
}
