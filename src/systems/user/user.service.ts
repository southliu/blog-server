import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PageUserDto } from './dto/page-user.dto';
import { PageUserVo } from './vo/page-user.vo';
import { Role } from '../role/entities/role.entity';
import { DetailUserVo } from './vo/detail-user.vo';

@Injectable()
export class UserService {
  @Inject(JwtService)
  private jwtService: JwtService;

  @InjectEntityManager()
  entityManager: EntityManager;

  async create(createDto: CreateUserDto) {
    try {
      const findRole = await this.entityManager.findOne(Role, {
        where: {
          id: createDto.roleId,
        },
      });
      if (!findRole) throw '获取角色数据失败';

      const findUsername = await this.entityManager.findOne(User, {
        where: {
          username: createDto.username,
        },
      });
      if (findUsername) throw '用户名已存在';

      const newUser = new User();
      newUser.isFrozen = createDto.status === 0;
      newUser.email = createDto.email;
      newUser.isAdmin = false;
      newUser.username = createDto.username;
      newUser.nickName = createDto.nickName;
      newUser.email = createDto.email;
      newUser.password = createDto.password;
      newUser.avatar = createDto.avatar;
      newUser.roles = [findRole];

      await this.entityManager.save(User, newUser);
      return '新增成功';
    } catch (e) {
      throw e || '新增失败';
    }
  }

  async findPage(pageDto: PageUserDto) {
    const { page, pageSize } = pageDto;
    const skipCount = (page - 1) * pageSize;
    const params = { ...pageDto };
    params.page = undefined;
    params.pageSize = undefined;

    const [record, total] = await this.entityManager.findAndCount(User, {
      where: {
        ...params,
      },
      skip: skipCount,
      take: pageSize,
      relations: ['roles'],
    });

    const items: PageUserVo[] = [];

    for (let i = 0; i < record?.length; i++) {
      const item = record[i];
      items.push({
        ...item,
        status: !item.isFrozen,
        roleName: item.roles.map((role) => role.name).join(','),
      });
    }

    return {
      items,
      total,
    };
  }

  async findOne(id: number) {
    try {
      const findUser = await this.entityManager.findOne(User, {
        where: {
          id,
        },
        relations: ['roles'],
      });

      const detailVo = new DetailUserVo();
      detailVo.id = findUser.id;
      detailVo.username = findUser.username;
      detailVo.nickName = findUser.nickName;
      detailVo.status = findUser.isFrozen ? 0 : 1;
      detailVo.phone = findUser.phone;
      detailVo.email = findUser.email;
      detailVo.avatar = findUser.avatar;
      detailVo.roleId = Number(findUser.roles.map((item) => item.id).join(','));

      return detailVo;
    } catch (e) {
      throw e || '获取详情失败';
    }
  }

  async getUserId(request: Request) {
    const authorization = request.headers?.authorization;
    const token = authorization?.split(' ')?.[1];
    const data = this.jwtService.verify(token);
    if (!data.userId) throw '获取用户信息失败';
    return data.userId;
  }

  async findUserById(userId: number, isAdmin?: boolean) {
    const user = await this.entityManager.findOne(User, {
      where: {
        id: userId,
        isAdmin: isAdmin ?? false,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      ...user,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const findRole = await this.entityManager.findOne(Role, {
        where: {
          id: updateUserDto.roleId,
        },
      });
      if (!findRole) throw '获取角色数据失败';

      await this.entityManager.save(User, {
        ...updateUserDto,
        id,
        isFrozen: updateUserDto.status === 0,
        roles: [findRole],
      });
      return '编辑成功';
    } catch (e) {
      throw e || '编辑失败';
    }
  }

  async remove(id: number) {
    try {
      const findUser = await this.entityManager.findOne(User, {
        where: { id },
      });
      if (!findUser) throw '当前数据不存在或已删除';

      await this.entityManager.delete(User, id);
      return '删除成功';
    } catch (e) {
      throw e || '删除失败';
    }
  }
}
