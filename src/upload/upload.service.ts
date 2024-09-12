import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File) {
    if (file === undefined) {
      throw new HttpException('请选择一个文件', HttpStatus.BAD_REQUEST);
    }
    console.log(file.path);
    const filePath = file.path.replace('uploads\\', 'static/');
    return {
      path: filePath,
    };
  }
}
