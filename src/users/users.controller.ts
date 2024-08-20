import {
  Controller,
  Get,
  Post,
  Body,
  Header,
  BadRequestException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, CreateUserDto } from './dto/create-user.dto';
import { HelloWorldInterceptor } from 'src/common/interceptors/hello-world/hello-world.interceptor';

import { UserName } from 'src/common/decorators/user-id/user-name.decorator';
import { RoleGuard } from 'src/common/guards/role/role.guard';

@Controller('users')
@UseInterceptors(HelloWorldInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(RoleGuard)
  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(RoleGuard)
  @Post()
  async create(@Body() createCatDto: CreateUserDto) {
    const validation = createUserSchema.safeParse(createCatDto);
    if (!validation.success) {
      throw new BadRequestException(
        validation.error.errors.map((e) => e.message).join(', '),
      );
    }
    return this.usersService.register(validation.data);
  }

  @UseGuards(RoleGuard)
  @Get(':username')
  async findOne(@UserName() username: string) {
    return this.usersService.findOne(username);
  }
}
