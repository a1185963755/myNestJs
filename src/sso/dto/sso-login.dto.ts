import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SsoLoginDto {
  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('test.usernameNotEmpty') })
  username: string;

  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('test.passwordNotEmpty') })
  @MinLength(6, {
    message: i18nValidationMessage('test.passwordNotLessThan6', {
      num: 6,
    }),
  })
  password: string;
}
