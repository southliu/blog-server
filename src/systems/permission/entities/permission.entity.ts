import { Menu } from 'src/systems/menu/entities/menu.entity';
import { Role } from 'src/systems/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '权限代码',
  })
  code: string;

  @Column({
    length: 100,
    comment: '权限描述',
  })
  description: string;

  @ManyToMany(() => Role, (roles) => roles.permissions)
  roles: Role[];

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'permission_menus',
  })
  menus: Menu[];
}
