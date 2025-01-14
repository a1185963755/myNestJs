import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class TaskService {
  @Inject(ArticleService)
  private readonly articleService: ArticleService;
  @Cron(CronExpression.EVERY_10_SECONDS)
  async flushArticle() {
    await this.articleService.flushRedisToDB();
  }
  @Timeout(500)
  logs() {
    console.log('flushArticle');
  }
}
