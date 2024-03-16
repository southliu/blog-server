import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { MenuService } from './/menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {
  RequireLogin,
  RequirePermission,
} from 'src/base/decorator/custom.decorator';
import { Request } from 'express';

// 权限前缀
const permissionPrefix = '/system/menu';

@Controller('/system/menu')
@RequireLogin()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @RequirePermission(`${permissionPrefix}/create`)
  create(@Body() createMenuDto: CreateMenuDto, @Req() request: Request) {
    return this.menuService.create(createMenuDto, request);
  }

  @Get('userMenu')
  findUserMenu(@Req() request: Request) {
    return this.menuService.findUserMenu(request);
  }

  @Get('list')
  @RequirePermission(`${permissionPrefix}/index`)
  findAll(@Req() request: Request, @Query('name') name: string) {
    return this.menuService.findAll(request, name);
  }

  @Get(':id')
  @RequirePermission(`${permissionPrefix}/index`)
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Put(':id')
  @RequirePermission(`${permissionPrefix}/update`)
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @RequirePermission(`${permissionPrefix}/delete`)
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.menuService.remove(+id, request);
  }
}
