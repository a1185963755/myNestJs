import { IsString } from 'class-validator';

export class SsoLoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
