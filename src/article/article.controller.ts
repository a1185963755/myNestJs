import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

/** express-session 里保存的登录用户（只用到 id）。 */
interface SessionWithUser extends Request {
  session: Request['session'] & { user?: { id: number } };
}

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Get(':id/view')
  viewOneArticle(
    @Param('id') id: string,
    @Session() session: SessionWithUser['session'],
    @Req() req: Request,
  ) {
    // 已登录用 user id 判重，未登录退回 IP
    const viewer = session?.user?.id ? `u${session.user.id}` : req.ip;
    return this.articleService.viewOneArticle(+id, viewer ?? 'unknown');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
