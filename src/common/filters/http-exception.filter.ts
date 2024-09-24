import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
type ExceptionResponse = {
  msg: string;
  code: number;
};
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ExceptionResponse;
    response.status(status).json({
      errCode: exceptionResponse?.code || status,
      errMsg: exceptionResponse?.msg || exception.message,
      path: request.url,
      timestamp: Date.now(),
    });
  }
}
