import { Controller, Post, Body } from '@nestjs/common';
import { SsoService } from './sso.service';
import { SsoBody } from './interfaces/sso.interface';

@Controller('sso')
export class SsoController {
  constructor(private readonly ssoService: SsoService) {}

  @Post('login')
  async create(@Body() ssoBody: SsoBody) {
    const user = await this.ssoService.validateUser(
      ssoBody.username,
      ssoBody.password,
    );
    return this.ssoService.login(user);
  }
}
