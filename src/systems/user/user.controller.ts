import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageUserDto } from './dto/page-user.dto';
import {
  RequireLogin,
  RequirePermission,
} from 'src/base/decorator/custom.decorator';

const permissionPrefix = '/system/user';

@Controller('/system/user')
@RequireLogin()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @RequirePermission(`${permissionPrefix}/create`)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('page')
  @RequirePermission(`${permissionPrefix}/index`)
  findPage(@Query() pageDto: PageUserDto) {
    return this.userService.findPage(pageDto);
  }

  @Get(':id')
  @RequirePermission(`${permissionPrefix}/index`)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermission(`${permissionPrefix}/update`)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermission(`${permissionPrefix}/delete`)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
