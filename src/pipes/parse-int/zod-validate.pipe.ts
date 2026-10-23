import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

interface ZodIssueLike {
  message: string;
  path: Array<string | number>;
}

/** Zod 的 error.message 是一段 JSON 字符串，这里解析成结构化 issue 列表。 */
function parseIssues(message: string): ZodIssueLike[] {
  try {
    const parsed: unknown = JSON.parse(message);
    return Array.isArray(parsed) ? (parsed as ZodIssueLike[]) : [];
  } catch {
    return [];
  }
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (!(error instanceof ZodError)) throw error;
      const errText = parseIssues(error.message)
        .map((item) =>
          item.message === 'Required'
            ? `参数【${String(item.path[0])}】不能为空`
            : item.message,
        )
        .join(',');
      // 校验失败属于客户端错误，返回 400 而不是 200
      throw new HttpException(
        errText || '参数校验失败',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
