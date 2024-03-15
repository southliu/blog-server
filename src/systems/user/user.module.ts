import { Module } from '@nestjs/common';
import { UserService } from './/user.service';
import { UserController } from './/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/systems/role/entities/role.entity';
import { Permission } from 'src/systems/permission/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
