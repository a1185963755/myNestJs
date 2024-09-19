import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('list')
  async list(@Query('name') name: string) {
    return this.bookService.list(name);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bookService.findById(+id);
  }

  @Post('create')
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Post('update')
  async update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto);
  }

  @Post('delete')
  async delete(@Body('id', ParseIntPipe) id: string) {
    return this.bookService.delete(+id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads/',
        filename(req, file, callback) {
          // 自定义文件名
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 3,
      },

      fileFilter(req, file, callback) {
        const filetypes = /jpg|jpeg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.split('.').pop()!);
        if (mimetype && extname) {
          return callback(null, true);
        } else {
          callback(
            new HttpException('文件类型不合法', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }
}
