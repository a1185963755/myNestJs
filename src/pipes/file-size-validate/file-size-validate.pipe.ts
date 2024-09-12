import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidatePipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    if (!value.mimetype.match(/csv/)) {
      throw new HttpException('文件类型不正确', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
