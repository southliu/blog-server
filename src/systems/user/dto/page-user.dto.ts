import { IsNotEmpty } from 'class-validator';

export class PageUserDto {
  @IsNotEmpty({
    message: '分页不能为空',
  })
  page: number;

  @IsNotEmpty({
    message: '分页大小不能为空',
  })
  pageSize: number;

  name: string;
  phone: string;
  email: string;
}
