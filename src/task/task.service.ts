import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class TaskService {
  @Inject(ArticleService)
  private readonly articleService: ArticleService;
  @Cron(CronExpression.EVERY_10_SECONDS)
  async flushArticle() {
    await this.articleService.flushRedisToDB();
  }
}
