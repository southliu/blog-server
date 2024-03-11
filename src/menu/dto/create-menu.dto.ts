import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty({
    message: '名称不能为空',
  })
  name: string;

  @IsNotEmpty({
    message: '权限不能为空',
  })
  permission: string;

  @IsNotEmpty({
    message: '菜单类型不能为空',
  })
  type: number;

  @IsNotEmpty({
    message: '排序不能为空',
  })
  sortNum: number;

  @IsNotEmpty({
    message: '父级ID不能为空',
  })
  parentId: number;
}
