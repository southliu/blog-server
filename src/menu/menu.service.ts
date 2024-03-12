import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Menu } from './entities/menu.entity';
import { MenuVo } from './vo/menu.vo';
import { Permission } from 'src/permission/entities/permission.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class MenuService {
  @Inject(JwtService)
  private jwtService: JwtService;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  /** 获取token信息 */
  private async getTokenInfo(request: Request) {
    const authorization = request.headers?.authorization;
    const token = authorization?.split(' ')?.[1];
    const data = this.jwtService.verify(token);
    return data;
  }

  /** 获取角色 */
  async getRoles(request: Request) {
    const result: Role[] = [];
    const tokenInfo = await this.getTokenInfo(request);

    const user = await this.userRepository.findOne({
      where: {
        id: tokenInfo.userId,
      },
      relations: ['roles'],
    });

    for (let i = 0; i < user.roles?.length; i++) {
      const item = user.roles[i];

      const role = await this.roleRepository.findOne({
        where: {
          id: item.id,
        },
        relations: ['permissions'],
      });

      if (role) result.push(role);
    }

    return result;
  }

  async create(createMenuDto: CreateMenuDto, request: Request) {
    try {
      const menu = new Menu();
      const parentId = Number(createMenuDto.parentId);
      menu.name = createMenuDto.name;
      menu.parentId = parentId === 0 ? null : parentId;
      menu.type = Number(createMenuDto.type);
      menu.sortNum = Number(createMenuDto.sortNum);

      const permission = new Permission();
      permission.code = createMenuDto.permission;
      permission.description = createMenuDto.name;

      permission.menus = [menu];

      const roles = await this.getRoles(request);
      for (let i = 0; i < roles?.length; i++) {
        const item = roles[i];
        item.permissions.push(permission);
      }

      await this.menuRepository.save([menu]);
      await this.permissionRepository.save([permission]);
      await this.roleRepository.save(roles);

      return roles;
    } catch (e) {
      throw '新增失败';
    }
  }

  private buildTree(
    menus: MenuVo[],
    parentId: number,
    isAll = false,
  ): MenuVo[] {
    const tree: MenuVo[] = [];

    for (const menu of menus) {
      // 权限按钮不返回
      if (!isAll && menu.type >= 2) return tree;

      if (menu.parentId === parentId) {
        const children = this.buildTree(menus, menu.id, isAll);
        if (children.length) {
          menu.children = children;
        }
        tree.push(menu);
      }
    }

    return tree;
  }

  private async getMenu(userId: number) {
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

    return menus;
  }

  async findAll(request: Request) {
    const data = await this.getTokenInfo(request);
    const menus = await this.getMenu(data.userId);
    return this.buildTree(menus, null, true);
  }

  async findUserMenu(request: Request) {
    const data = await this.getTokenInfo(request);
    const menus = await this.getMenu(data.userId);
    return this.buildTree(menus, null);
  }

  async findOne(id: number) {
    try {
      const findMenu = await this.menuRepository.findOne({
        where: {
          id,
        },
        relations: ['permissions'],
      });

      const menuVo: MenuVo = {
        id: findMenu.id,
        name: findMenu.name,
        route: findMenu.route,
        icon: findMenu.icon,
        sortNum: findMenu.sortNum,
        enable: findMenu.enable,
        type: findMenu.type,
        parentId: findMenu.parentId || 0,
        permission: findMenu.permissions?.map((item) => item.code)?.join(','),
      };

      return menuVo;
    } catch (e) {
      throw '获取详情失败';
    }
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    try {
      console.log('updateMenuDto:', updateMenuDto);
      // const findMenu = await this.menuRepository.findOne({
      //   where: {
      //     id,
      //   },
      //   relations: ['permissions'],
      // });

      // const menuVo: MenuVo = {
      //   id: updateMenuDto.id,
      //   name: updateMenuDto.name,
      //   route: updateMenuDto.route,
      //   icon: updateMenuDto.icon,
      //   sortNum: updateMenuDto.sortNum,
      //   enable: updateMenuDto.enable,
      //   type: updateMenuDto.type,
      //   parentId: updateMenuDto.parentId || 0,
      //   permission: updateMenuDto.permissions,
      // };

      await this.menuRepository.save({
        ...updateMenuDto,
        id,
      });

      return '编辑成功';
    } catch (e) {
      throw '编辑失败';
    }
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
