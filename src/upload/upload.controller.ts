import {
  BadRequestException,
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 20))
  upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('未上传任何文件');
    }
    return this.uploadService.uploadFile([...files]);
  }

  @Post('chunk')
  @UseInterceptors(FilesInterceptor('chunk', 20))
  uploadChunk(
    @UploadedFiles() chunk: Array<Express.Multer.File>,
    @Body('name') name: string,
  ) {
    return this.uploadService.uploadChunk(chunk, name);
  }

  @Post('merge')
  mergeChunks(@Body('name') name: string) {
    return this.uploadService.mergeChunks(name);
  }

  /**
   * GIF 压缩下载。
   *
   * 传入的 path 必须是 uploads 目录内的相对路径 —— 之前直接把 body.path
   * 丢给 sharp 读文件，`../../etc/passwd` 之类的路径可以任意读取服务器文件。
   */
  @Post('compression')
  async compression(
    @Body('path') filePath: string,
    @Body('color', ParseIntPipe) color: number,
    @Res() res: Response,
  ) {
    const buffer = await this.uploadService.compression(filePath, color);
    res.set('Content-Disposition', `attachment; filename="dest.gif"`);
    res.send(buffer);
  }
}
