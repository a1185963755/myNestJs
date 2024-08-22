import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async getTodos() {
    const res = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/todos'),
    );
    const todos = res.data;
    return todos;
  }
}
