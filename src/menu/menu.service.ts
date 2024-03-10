import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { Menu } from './entities/menu.entity';
import { MenuVo } from './vo/menu.vo';

@Injectable()
export class MenuService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  create(createMenuDto: CreateMenuDto) {
    return 'This action adds a new menu';
  }

  private buildTree(menus: MenuVo[], parentId: number): MenuVo[] {
    const tree: MenuVo[] = [];

    for (const menu of menus) {
      console.log('menu:', menu);
      if (menu.parentId === parentId) {
        const children = this.buildTree(menus, menu.id);
        if (children.length) {
          menu.children = children;
        }
        tree.push(menu);
      }
    }

    return tree;
  }

  async findAll(userId: number) {
    const findUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles.permissions', 'roles.permissions.menus'],
    });

    const menus: MenuVo[] = [];

    for (let i = 0; i < findUser.roles?.length; i++) {
      for (let j = 0; j < findUser.roles[i]?.permissions?.length; j++) {
        for (
          let k = 0;
          k < findUser.roles[i].permissions[j].menus?.length;
          k++
        ) {
          const item = findUser.roles[i].permissions[j].menus[k];
          menus.push({
            id: item.id,
            name: item.name,
            route: item.route,
            icon: item.icon,
            sortNum: item.sortNum,
            enable: item.enable,
            type: item.type,
            permission: findUser.roles[i]?.permissions?.[j]?.code,
            parentId: item.parentId,
          });
        }
      }
    }

    return this.buildTree(menus, null);
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
