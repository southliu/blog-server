import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Inject,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from 'src/email/dto/email.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/systems/user/user.service';
import { RequireLogin } from 'src/base/decorator/custom.decorator';
import { Request } from 'express';

@Controller('')
export class PublicController {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(UserService)
  private userService: UserService;

  constructor(private readonly publicService: PublicService) {}

  @Get('register-captcha')
  async captcha(@Query() emailDto: EmailDto) {
    return this.publicService.getRegister(emailDto);
  }

  @Post('register')
  register(@Body() registerUser: RegisterDto) {
    return this.publicService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: LoginDto) {
    try {
      const vo = await this.publicService.login(loginUser);

      vo.token = this.jwtService.sign(
        {
          userId: vo.userInfo.id,
          username: vo.userInfo.username,
          roles: vo.roles,
          permissions: vo.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      return vo;
    } catch (e) {
      throw '登录失败';
    }
  }

  @Get('refresh')
  @RequireLogin()
  async refresh(@Req() request: Request) {
    try {
      const authorization = request.headers?.authorization;
      const token = authorization?.split(' ')?.[1];
      const data = this.jwtService.verify(token);
      return this.publicService.refresh(data.userId);
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('init-data')
  async initData() {
    return this.publicService.initData();
  }
}
