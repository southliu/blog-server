import { Controller, Get, Post, Body, Query, Inject } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { PublicService } from './public.service';
import { RegisterDto } from './dot/register.dto';

@Controller('')
export class PublicController {
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  constructor(private readonly publicService: PublicService) {}

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
  }

  @Post('register')
  register(@Body() registerUser: RegisterDto) {
    return this.publicService.register(registerUser);
  }

  @Post('login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.publicService.login(username, password);
  }
}
