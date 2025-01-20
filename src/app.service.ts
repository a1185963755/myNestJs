import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  @Inject()
  i18n: I18nService;
  async getTodos() {
    const res = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/todos'),
    );
    const todos = res.data;
    return todos;
  }

  getHello(): string {
    return this.i18n.t('test.hello', {
      lang: I18nContext.current()?.lang ?? 'zh', // 默认使用中文
    });
  }
}
