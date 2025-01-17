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
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import { Response } from 'express';

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

  @Post('compression')
  async compression(
    @Body('path') filePath: string,
    @Body('color', ParseIntPipe) color: number,
    @Res() res: Response,
  ) {
    console.log(filePath, color);

    if (!existsSync(filePath)) {
      throw new BadRequestException('文件不存在');
    }
    const buffer = await this.uploadService.compression(filePath, color);
    res.set('Content-Disposition', `attachment; filename="dest.gif"`);
    res.send(buffer);
  }
}
