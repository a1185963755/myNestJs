import { IsUrl, MaxLength } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl(
    { require_protocol: true },
    { message: 'url 必须是合法的 http(s) 地址' },
  )
  @MaxLength(200)
  url: string;
}
