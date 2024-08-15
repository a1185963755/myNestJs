import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File) {
    if (file === undefined) {
      return { message: '请选择一个文件' };
    }
    if (!file.mimetype.match(/csv/)) {
      return {
        code: 200,
        message: '请上传csv文件',
        file,
      };
    }
    return {
      code: 200,
      message: 'success',
      file,
    };
  }
}
