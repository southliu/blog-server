import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PageUserDto } from './dto/page-user.dto';

@Injectable()
export class UserService {
  @Inject(JwtService)
  private jwtService: JwtService;

  @InjectEntityManager()
  entityManager: EntityManager;

  create(createUserDto: CreateUserDto) {
    console.log('createUserDto:', createUserDto);
    return 'This action adds a new user';
  }

  findPage(pageUserDto: PageUserDto) {
    return pageUserDto;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto:', updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
