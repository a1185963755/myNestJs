import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 20))
  upload(@UploadedFiles() files: Array<Express.Multer.File>) {
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
}
