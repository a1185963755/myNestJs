import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SsoService } from './sso.service';
import { SsoController } from './sso.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '60m',
        },
      }),
    }),
  ],
  controllers: [SsoController],
  providers: [SsoService, JwtStrategy],
  // 其他模块（如 qrcode / users）用 AuthGuard('jwt') 校验 token，
  // 需要能注入 JwtService 时从这里取；之前写的是 exports: [SsoModule]，
  // 导出的是模块类自身，Nest 启动时会直接报错。
  exports: [JwtModule],
})
export class SsoModule {}
