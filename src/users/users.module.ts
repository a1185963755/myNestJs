import {
  BeforeApplicationShutdown,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule
  implements
    OnModuleInit,
    OnModuleDestroy,
    OnApplicationBootstrap,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  onModuleInit(): void {
    console.log('[AppModule]: init');
  }
  onModuleDestroy(): void {
    console.log('[AppModule]: destroy');
  }
  onApplicationBootstrap(): void {
    console.log('[AppModule]: bootstrap');
  }
  beforeApplicationShutdown(): void {
    console.log('[AppModule]: before shutdown event!');
  }
  onApplicationShutdown(): void {
    console.log('[AppModule]: shutdown event!');
  }
}
