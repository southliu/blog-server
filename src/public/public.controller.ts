import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from 'src/email/dto/email.dto';

@Controller('')
export class PublicController {
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
  login(@Body() loginUser: LoginDto) {
    return this.publicService.login(loginUser);
  }
}
