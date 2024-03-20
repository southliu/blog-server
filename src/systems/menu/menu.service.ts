import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from 'src/systems/user/entities/user.entity';
import { Menu } from './entities/menu.entity';
import { DetailMenuVo } from './vo/detail-menu.vo';
import { Permission } from 'src/systems/permission/entities/permission.entity';
import { Request } from 'express';
import { Role } from 'src/systems/role/entities/role.entity';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';

// TODO: 优化定时清除
const permissionMap: Map<number, Permission[]> = new Map();

@Injectable()
export class MenuService {
  @Inject(UserService)
  userService: UserService;

  @Inject(RoleService)
  roleService: RoleService;

  @InjectEntityManager()
  entityManager: EntityManager;

  // 查看是否有查看权限
  private hasView(menus: DetailMenuVo[]) {
    for (let i = 0; i < menus?.length; i++) {
      const item = menus[i];
      if (item.type < 2) return true;
      const arr = item?.permission?.split('/');

      if (arr?.length && arr[arr.length - 1] === 'index') {
        return true;
      }
    }

    return false;
  }

  // 过滤没有查看权限的菜单
  private filterViewMenu(menus: DetailMenuVo[]) {
    const tree: DetailMenuVo[] = [];

    for (let i = 0; i < menus?.length; i++) {
      const item = menus[i];

      if (item.type <= 2 && !item.children?.length) continue;

      // 子数据是否有查看权限
      if (item.children?.length) {
        const hasView = this.hasView(item.children);
        item.children = hasView
          ? this.filterViewMenu(item.children)
          : undefined;
      }

      tree.push(item);
    }

    // 排序
    tree.sort((a, b) => a.sortNum - b.sortNum);

    return tree;
  }

  private buildTree(menus: DetailMenuVo[], parentId: number): DetailMenuVo[] {
    const tree: DetailMenuVo[] = [];

    for (const menu of menus) {
      if (menu.parentId === parentId) {
        const children = this.buildTree(menus, menu.id);
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
    const findUser = await this.entityManager.findOne(User, {
      where: {
        id: userId,
      },
      relations: [
        'roles.permissions',
        'roles.permissions.menus',
        'roles.permissions.menus.parent',
      ],
    });

    const menus: DetailMenuVo[] = [];

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

  private handleSearchList(menu: DetailMenuVo[], name: string) {
    const result: DetailMenuVo[] = [];

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
    const userId = await this.userService.getUserId(request);
    const menus = await this.getMenu(userId);
    const newMenus = this.buildTree(menus, null);

    if (!name) return newMenus;
    return this.handleSearchList(newMenus, name);
  }

  async findUserMenu(request: Request) {
    const userId = await this.userService.getUserId(request);
    const menus = await this.getMenu(userId);
    const allMenus = this.buildTree(menus, null);
    return this.filterViewMenu(allMenus);
  }

  async findOne(id: number) {
    try {
      const findMenu = await this.entityManager.findOne(Menu, {
        where: {
          id,
        },
        relations: ['permissions'],
      });

      const DetailMenuVo: DetailMenuVo = {
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

      return DetailMenuVo;
    } catch (e) {
      throw e || '获取详情失败';
    }
  }

  async create(createMenuDto: CreateMenuDto, request: Request) {
    try {
      const menu = new Menu();
      menu.name = createMenuDto.name;
      menu.route = createMenuDto.route;
      menu.icon = createMenuDto.icon;
      menu.type = Number(createMenuDto.type);
      menu.sortNum = Number(createMenuDto.sortNum);

      const parentId = Number(createMenuDto.parentId);

      if (parentId) {
        const parent = await this.entityManager.findOne(Menu, {
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

      const userId = await this.userService.getUserId(request);
      const roles = await this.roleService.getRoles(request);
      if (!roles?.length) throw '获取角色数据失败';

      permission.menus = [menu];
      await this.entityManager.save(Menu, menu);
      const newPermission = await this.entityManager.save(
        Permission,
        permission,
      );

      const hasRoles = permissionMap.has(userId);

      if (!hasRoles) {
        permissionMap.set(userId, [newPermission]);
      }

      const oldPermissionMap = permissionMap.get(userId);
      oldPermissionMap.push(newPermission);
      permissionMap.set(userId, oldPermissionMap);

      for (let i = 0; i < roles?.length; i++) {
        const item = roles[i];

        const hasPermission = oldPermissionMap.find(
          (permission) => permission.id === item.id,
        );
        if (!hasPermission) item.permissions.push(permission);
      }

      await this.entityManager.save(Role, roles);

      return '新增成功';
    } catch (e) {
      throw e || '新增失败';
    }
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    try {
      if (updateMenuDto.permission?.length > 50) {
        throw '权限字段过长';
      }

      const findMenu = await this.entityManager.findOne(Menu, {
        where: {
          id,
        },
        relations: ['permissions'],
      });

      await this.entityManager.save(Menu, {
        ...updateMenuDto,
        id,
      });

      for (let i = 0; i < findMenu.permissions?.length; i++) {
        const item = findMenu.permissions[i];
        item.code = updateMenuDto.permission;
        item.description = updateMenuDto.name;
        await this.entityManager.save(Permission, item);
      }

      return '编辑成功';
    } catch (e) {
      throw e || '编辑失败';
    }
  }

  async remove(id: number, request: Request) {
    try {
      const roles: Role[] = await this.roleService.getRoles(request);
      if (!roles?.length) throw '获取角色数据失败';

      const findMenu = await this.entityManager.findOne(Menu, {
        where: { id },
        relations: ['permissions'],
      });
      if (!findMenu?.permissions?.length) throw '当前菜单不存在或已删除';

      const parent = await this.entityManager.findOne(Menu, {
        where: { id },
      });

      const findChildren = await this.entityManager
        .getTreeRepository(Menu)
        .findDescendantsTree(parent);

      if (findChildren?.children?.length) {
        throw '子数据的数据未清空，不可删除';
      }

      const permissionId = findMenu.permissions?.[0]?.id;

      for (let i = 0; i < roles?.length; i++) {
        const item = roles[i];
        const index = item.permissions?.findIndex(
          (item) => item.id === permissionId,
        );
        if (index !== -1) item.permissions?.splice(index, 1);
      }
      await this.entityManager.save(Role, roles);

      if (permissionId) {
        await this.entityManager.delete(Permission, permissionId);
      }

      await this.entityManager.delete(Menu, id);

      return '删除成功';
    } catch (e) {
      throw e || '删除失败，请稍后重试';
    }
  }
}
