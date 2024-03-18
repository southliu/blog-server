import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Request } from 'express';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleService {
  @Inject(UserService)
  userService: UserService;

  @InjectEntityManager()
  entityManager: EntityManager;

  create(createRoleDto: CreateRoleDto) {
    console.log('createRoleDto:', createRoleDto);
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  /** 获取角色 */
  async getRoles(request: Request) {
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

  update(id: number, updateRoleDto: UpdateRoleDto) {
    console.log('updateRoleDto:', updateRoleDto);
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
