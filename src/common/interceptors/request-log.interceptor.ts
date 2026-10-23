import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import * as requestIp from 'request-ip';
import { getRequestId } from '../context/request-id.context';
import type { TimedRequest } from '../types/http.types';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<TimedRequest>();
    const response = context.switchToHttp().getResponse<Response>();
    const userAgent = request.headers['user-agent'];

    const { ip, method, path } = request;
    const clientIp = requestIp.getClientIp(request) || ip;
    const requestId = getRequestId();
    request.startTime = Date.now();
    this.logger.debug(
      `[${requestId ?? '-'}] ${method} ${path} ${clientIp} ${userAgent}: ${context.getClass().name} ${context.getHandler().name} invoked...`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        // 只记录状态码与耗时：之前把整个响应体 JSON.stringify 进日志，
        // 登录接口会把 access_token / 用户信息直接落到日志里。
        this.logger.debug(
          `[${requestId ?? '-'}] ${method} ${path} ${clientIp} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
