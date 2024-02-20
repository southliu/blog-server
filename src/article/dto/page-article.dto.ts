import { IsNotEmpty } from 'class-validator';

export class PageArticleDto {
  @IsNotEmpty({
    message: '分页数不能为空',
  })
  current: number;

  @IsNotEmpty({
    message: '分页总数不能为空',
  })
  pageSize: number;
}
