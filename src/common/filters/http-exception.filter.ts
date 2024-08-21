import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('🚀 ~ HttpExceptionFilter ~ exception:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response.status(status).json({
      errCode: status,
      errMsg: exception.message,
      path: request.url,
      timestamp: Date.now(),
    });
  }
}
