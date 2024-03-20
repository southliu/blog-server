import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '姓名不能为空',
  })
  nickName: string;

  @IsNotEmpty({
    message: '角色不能为空',
  })
  roleId: number;

  @IsNotEmpty({
    message: '状态不能为空',
  })
  status: number;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @IsOptional()
  @IsPhoneNumber('CN', {
    message: '电话号码格式不正确',
  })
  phone: string;
  email: string;
  avatar: string;
}
