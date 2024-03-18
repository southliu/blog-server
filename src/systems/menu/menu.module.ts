import { Module } from '@nestjs/common';
import { MenuService } from './/menu.service';
import { MenuController } from './/menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/systems/user/entities/user.entity';
import { Menu } from './entities/menu.entity';
import { Permission } from 'src/systems/permission/entities/permission.entity';
import { Role } from 'src/systems/role/entities/role.entity';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Menu, Role, Permission])],
  controllers: [MenuController],
  providers: [MenuService, UserService, RoleService],
})
export class MenuModule {}
