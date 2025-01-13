import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Session,
} from '@nestjs/common';
import { SsoService } from './sso.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { SsoLoginDto } from './dto/sso-login.dto';
import { SsoEmailLoginDto } from './dto/sso-email-login.dto';

@Controller('sso')
export class SsoController {
  constructor(
    private readonly ssoService: SsoService,
    private readonly UsersService: UsersService,
  ) {}

  @Post('login')
  async loginByPwd(@Body() ssoBody: SsoLoginDto, @Session() session: any) {
    const user = await this.ssoService.validateUser(
      ssoBody.username,
      ssoBody.password,
    );
    session.user = user;
    return this.ssoService.login(user);
  }
  @Post('emailLogin')
  async loginByEmail(@Body() ssoBody: SsoEmailLoginDto) {
    const user = await this.ssoService.validateUserByEmail(
      ssoBody.email,
      ssoBody.code,
    );
    return this.ssoService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  async getUser(@Param('username') username: string) {
    const data = await this.UsersService.findOne(username);
    if (!data) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const { password, ...others } = data!;
    console.log('🚀 ~ SsoController ~ getUser ~ password:', password);
    return others;
  }
}
