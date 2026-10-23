import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import { I18nValidationException } from 'nestjs-i18n';
import { getRequestId } from '../context/request-id.context';
import { RequestWithId } from '../middleware/request-id/request-id.middleware';

interface ErrorBody {
  errCode: number | string;
  errMsg: string;
  requestId?: string;
  path: string;
  timestamp: string;
}

/** 把 I18nValidationException 里的 ValidationError 树摊平成可读字符串。 */
function flattenValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];
  const walk = (list: ValidationError[]) => {
    for (const item of list) {
      if (item.constraints) {
        messages.push(...Object.values(item.constraints));
      }
      if (item.children?.length) {
        walk(item.children);
      }
    }
  };
  walk(errors);
  return messages;
}

/**
 * 全局异常过滤器（唯一一个，通过 CommonModule 的 APP_FILTER 注册）。
 *
 * 之前 main.ts 里又 useGlobalFilters 注册了一次，且 I18nValidationExceptionFilter
 * 排在它后面 —— 而本过滤器没有 @Catch 限制、会匹配所有异常，
 * 导致 i18n 校验错误永远到不了 I18nValidationExceptionFilter。
 * 现在统一在这里处理（含 i18n 校验错误），main.ts 不再重复注册。
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();
    const requestId = getRequestId() ?? request.requestId;

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let errCode: number | string = status;
    let errMsg: string;

    if (exception instanceof I18nValidationException) {
      const messages = flattenValidationErrors(exception.errors ?? []);
      errCode = HttpStatus.BAD_REQUEST;
      errMsg = messages.length > 0 ? messages.join('; ') : exception.message;
    } else if (isHttp) {
      const body = exception.getResponse();
      if (typeof body === 'string') {
        errMsg = body;
      } else {
        const payload = body as Record<string, unknown>;
        const code = payload.code;
        if (typeof code === 'number' || typeof code === 'string') {
          errCode = code;
        }
        const message = payload.msg ?? payload.message;
        errMsg = Array.isArray(message)
          ? message.join('; ')
          : String(message ?? exception.message);
      }
    } else {
      errMsg = '服务器内部错误';
      this.logger.error(
        `[${requestId ?? '-'}] ${request.method} ${request.url} 未处理异常`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorBody = {
      errCode,
      errMsg,
      requestId,
      path: request.url,
      timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
    };
    response
      .status(isHttp ? status : HttpStatus.INTERNAL_SERVER_ERROR)
      .json(body);
  }
}
