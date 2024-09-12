import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File) {
    if (file === undefined) {
      return { message: '请选择一个文件' };
    }
    return {
      code: 200,
      message: 'success',
      file,
    };
  }
}
