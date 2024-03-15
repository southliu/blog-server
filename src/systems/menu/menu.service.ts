import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/systems/user/entities/user.entity';
import { Menu } from './entities/menu.entity';
import { MenuVo } from './vo/menu.vo';
import { Permission } from 'src/systems/permission/entities/permission.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/systems/role/entities/role.entity';

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

  @InjectEntityManager()
  entityManager: EntityManager;

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

    // 排序
    tree.sort((a, b) => a.sortNum - b.sortNum);

    return tree;
  }

  private async getMenu(userId: number) {
    const findUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: [
        'roles.permissions',
        'roles.permissions.menus',
        'roles.permissions.menus.parent',
      ],
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
            parentId: item.parent?.id || null,
          });
        }
      }
    }

    return menus;
  }

  private handleSearchList(menu: MenuVo[], name: string) {
    const result: MenuVo[] = [];

    for (let i = 0; i < menu.length; i++) {
      const item = menu[i];

      // 当有子数据
      if (item.children?.length > 0 && !item.name?.includes(name)) {
        item.children = this.handleSearchList(item.children, name);
      }

      // 当名称包含名称
      if (item.name?.includes(name) || item.children?.length) {
        result.push(item);
      }
    }

    return result;
  }

  async findAll(request: Request, name: string) {
    const data = await this.getTokenInfo(request);
    const menus = await this.getMenu(data.userId);
    const newMenus = this.buildTree(menus, null, true);

    if (!name) return newMenus;
    return this.handleSearchList(newMenus, name);
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
        parentId: findMenu.parent?.id || 0,
        permission: findMenu.permissions?.map((item) => item.code)?.join(','),
      };

      return menuVo;
    } catch (e) {
      throw e || '获取详情失败';
    }
  }

  async create(createMenuDto: CreateMenuDto, request: Request) {
    try {
      const roles = await this.getRoles(request);
      if (!roles?.length) throw '获取角色数据失败';

      const menu = new Menu();
      menu.name = createMenuDto.name;
      menu.route = createMenuDto.route;
      menu.icon = createMenuDto.icon;
      menu.type = Number(createMenuDto.type);
      menu.sortNum = Number(createMenuDto.sortNum);

      const parentId = Number(createMenuDto.parentId);

      if (parentId) {
        const parent = await this.menuRepository.findOne({
          where: {
            id: parentId,
          },
        });
        if (!parent) throw '当前父级菜单不存在!';
        menu.parent = parent;
      }

      const permission = new Permission();
      permission.code = createMenuDto.permission;
      permission.description = createMenuDto.name;

      for (let i = 0; i < roles?.length; i++) {
        const item = roles[i];
        item.permissions.push(permission);
      }

      permission.menus = [menu];
      await this.menuRepository.save(menu);
      await this.permissionRepository.save(permission);
      await this.roleRepository.save(roles);

      return roles;
    } catch (e) {
      throw e || '新增失败';
    }
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    try {
      const findMenu = await this.menuRepository.findOne({
        where: {
          id,
        },
        relations: ['permissions'],
      });

      await this.menuRepository.save({
        ...updateMenuDto,
        id,
      });

      for (let i = 0; i < findMenu.permissions?.length; i++) {
        const item = findMenu.permissions[i];
        item.code = updateMenuDto.permission;
        await this.permissionRepository.save(item);
      }

      return '编辑成功';
    } catch (e) {
      throw e || '编辑失败';
    }
  }

  async remove(id: number) {
    try {
      const findMenu = await this.menuRepository.findOne({
        where: { id },
        relations: ['permissions'],
      });
      if (!findMenu?.permissions?.length) throw '当前菜单不存在或已删除';
      if (findMenu.permissions?.[0]?.id) {
        await this.permissionRepository.delete(findMenu.permissions?.[0]?.id);
      }
      await this.menuRepository.delete(id);
      return '删除成功';
    } catch (e) {
      throw e || '删除失败，请稍后重试';
    }
  }
}
