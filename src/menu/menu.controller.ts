import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Inject,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { RequireLogin } from 'src/decorator/custom.decorator';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('menu')
@RequireLogin()
export class MenuController {
  @Inject(JwtService)
  private jwtService: JwtService;

  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get('list')
  findAll(@Req() request: Request) {
    const authorization = request.headers?.authorization;
    const token = authorization?.split(' ')?.[1];
    const data = this.jwtService.verify(token);

    return this.menuService.findAll(data.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
