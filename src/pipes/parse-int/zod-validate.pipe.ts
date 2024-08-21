import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch ({ message }) {
      const _message = JSON.parse(message);
      const errText = _message
        .map((item: any) => {
          if (item.message == 'Required') {
            return `参数【${item.path[0]}】不能为空`;
          }
          return item.message;
        })
        .join(',');
      throw new BadRequestException(`参数校验失败=>${errText}`);
    }
  }
}
