import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Menu } from './entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Menu])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
