import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [ArticleModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
