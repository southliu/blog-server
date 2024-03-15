import { Permission } from 'src/systems/permission/entities/permission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'menus',
})
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '菜单名',
  })
  name: string;

  @Column({
    length: 50,
    comment: '路由',
    nullable: true,
  })
  route: string;

  @Column({
    length: 50,
    comment: '图标',
    nullable: true,
  })
  icon: string;

  @Column({
    comment: '排序',
  })
  sortNum: number;

  @Column({
    comment: '是否启用',
    nullable: true,
    default: true,
  })
  enable: boolean;

  @Column({
    comment: '类型: 0—目录 1—菜单 2—按钮',
  })
  type: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @TreeChildren()
  children: Menu[];

  @TreeParent()
  parent: Menu;

  @ManyToMany(() => Permission, (permissions) => permissions.menus)
  permissions: Permission[];
}
