import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/systems/user/entities/user.entity';
import { Role } from 'src/systems/role/entities/role.entity';
import { UserService } from 'src/systems/user/user.service';
import { Permission } from 'src/systems/permission/entities/permission.entity';
import { Menu } from 'src/systems/menu/entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Menu, Permission])],
  controllers: [PublicController],
  providers: [PublicService, UserService],
})
export class PublicModule {}
