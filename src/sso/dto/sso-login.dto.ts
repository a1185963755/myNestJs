import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SsoLoginDto {
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty({
    message: 'test.passwordNotEmpty',
  })
  @MinLength(6, {
    message: i18nValidationMessage('test.passwordNotLessThan6', {
      num: 8,
    }),
  })
  password: string;
}
