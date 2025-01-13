import { IsEmail, IsNotEmpty } from 'class-validator';

export class SsoEmailLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;
}
