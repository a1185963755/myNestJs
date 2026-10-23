import { ValidationError } from 'class-validator';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class ClassValidatePipe implements PipeTransform<unknown> {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errText = errors
        .map((err: ValidationError) =>
          Object.values(err.constraints ?? {}).join(';'),
        )
        .filter(Boolean)
        .join(';');
      // 校验失败属于客户端错误，返回 400 而不是 200
      throw new HttpException(
        errText || '参数校验失败',
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype: unknown): boolean {
    const types: unknown[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
