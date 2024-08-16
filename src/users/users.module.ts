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
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
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
