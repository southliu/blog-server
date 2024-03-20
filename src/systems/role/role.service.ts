import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Request } from 'express';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { PageRoleDto } from './dto/page-role.dto';

@Injectable()
export class RoleService {
  @Inject(UserService)
  userService: UserService;

  @InjectEntityManager()
  entityManager: EntityManager;

  async create(createRoleDto: CreateRoleDto) {
    try {
      await this.entityManager.save(Role, createRoleDto);
      return '新增成功';
    } catch (e) {
      throw e || '新增失败';
    }
  }

  async findAll() {
    const result = await this.entityManager.find(Role);
    return result;
  }

  async findPage(pageDto: PageRoleDto) {
    const { page, pageSize } = pageDto;
    const skipCount = (page - 1) * pageSize;
    const params = { ...pageDto };
    params.page = undefined;
    params.pageSize = undefined;

    const [items, total] = await this.entityManager.findAndCount(Role, {
      where: {
        ...params,
      },
      skip: skipCount,
      take: pageSize,
    });

    return {
      items,
      total,
    };
  }

  async findOne(id: number) {
    try {
      const findRole = await this.entityManager.findOne(Role, {
        where: {
          id,
        },
      });

      return findRole;
    } catch (e) {
      throw e || '获取详情失败';
    }
  }

  /** 获取角色 */
  async getRoles(request: Request): Promise<Role[]> {
    const result: Role[] = [];
    const userId = await this.userService.getUserId(request);

    const user = await this.entityManager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ['roles'],
    });

    for (let i = 0; i < user.roles?.length; i++) {
      const item = user.roles[i];

      const role = await this.entityManager.findOne(Role, {
        where: {
          id: item.id,
        },
        relations: ['permissions'],
      });

      if (role) result.push(role);
    }

    return result;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      await this.entityManager.save(Role, {
        ...updateRoleDto,
        id,
      });
      return '编辑成功';
    } catch (e) {
      throw e || '编辑失败';
    }
  }

  async remove(id: number) {
    try {
      const findRole = await this.entityManager.findOne(Role, {
        where: { id },
      });
      if (!findRole) throw '当前数据不存在或已删除';

      await this.entityManager.delete(Role, id);
      return '删除成功';
    } catch (e) {
      throw e || '删除失败';
    }
  }
}
