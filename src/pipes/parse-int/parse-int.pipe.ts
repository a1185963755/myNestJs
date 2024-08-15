import {
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: any) {
    const integer = parseInt(value);
    if (isNaN(integer)) {
      throw new NotAcceptableException('id必须是数字');
    }
    return integer;
  }
}
