import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: '名称不能为空',
  })
  name: string;
}
