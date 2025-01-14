import { Inject, Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class TaskService {
  @Inject(ArticleService)
  private readonly articleService: ArticleService;

  async flushArticle() {
    await this.articleService.flushRedisToDB();
  }
}
