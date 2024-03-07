import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserService } from 'src/user/user.service';
import { Permission } from 'src/permission/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [PublicController],
  providers: [PublicService, UserService],
})
export class PublicModule {}
