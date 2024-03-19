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
import { RoleService } from './/role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PageRoleDto } from './dto/page-role.dto';
import {
  RequireLogin,
  RequirePermission,
} from 'src/base/decorator/custom.decorator';

const permissionPrefix = '/system/role';

@Controller('/system/role')
@RequireLogin()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @RequirePermission(`${permissionPrefix}/create`)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get('all')
  @RequirePermission(`${permissionPrefix}/index`)
  findAll() {
    return this.roleService.findAll();
  }

  @Get('page')
  @RequirePermission(`${permissionPrefix}/index`)
  findPage(@Query() pageDto: PageRoleDto) {
    return this.roleService.findPage(pageDto);
  }

  @Get(':id')
  @RequirePermission(`${permissionPrefix}/index`)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermission(`${permissionPrefix}/update`)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @RequirePermission(`${permissionPrefix}/delete`)
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
