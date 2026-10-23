import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: '文章标题不能为空' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '文章内容不能为空' })
  content: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  likeCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  collectCount?: number;
}
