import { Module } from '@nestjs/common';
import { RoleService } from './/role.service';
import { RoleController } from './/role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from './entities/role.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [RoleController],
  providers: [RoleService, UserService],
})
export class RoleModule {}
