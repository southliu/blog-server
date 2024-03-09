import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from 'src/email/dto/email.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import {
  RequireLogin,
  RequirePermission,
} from 'src/decorator/custom.decorator';

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
  @RequirePermission('ddd')
  async login(@Body() loginUser: LoginDto) {
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

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );

    return vo;
  }

  @Get('refresh')
  @RequireLogin()
  async refresh(@Query('refreshToken') oldRefreshToken: string) {
    try {
      const data = this.jwtService.verify(oldRefreshToken);
      const user = await this.userService.findUserById(data.userId);

      const token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refreshToken = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expires_time') || '7d',
        },
      );

      return {
        token,
        refreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
}
