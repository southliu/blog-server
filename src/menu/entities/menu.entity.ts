import { Permission } from 'src/permission/entities/permission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
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
  })
  route?: string;

  @Column({
    length: 50,
    comment: '图标',
  })
  icon?: string;

  @Column({
    comment: '排序',
  })
  sortNum: number;

  @Column({
    comment: '是否启用',
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

  @ManyToOne(() => Menu, {
    cascade: true,
  })
  pId: Menu;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'menu_permissions',
  })
  permissions: Permission[];
}
