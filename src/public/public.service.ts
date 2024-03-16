import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from 'src/base/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/systems/user/entities/user.entity';
import { md5 } from 'src/utils/helper';
import { UserService } from 'src/systems/user/user.service';
import { LoginDto } from './dto/login.dto';
import { BaseException } from 'src/utils/exception';
import { EmailService } from 'src/email/email.service';
import { EmailDto } from 'src/email/dto/email.dto';
import { Role } from 'src/systems/role/entities/role.entity';
import { LoginVo } from './vo/login.vo';

@Injectable()
export class PublicService {
  private logger = new Logger();

  @Inject(RedisService)
  private redisService: RedisService;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @Inject(EmailService)
  private emailService: EmailService;

  async getRegister(emailDto: EmailDto) {
    const { email } = emailDto;
    const foundEmail = await this.userRepository.findOneBy({ email });
    if (foundEmail) {
      throw new BaseException('邮箱已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${email}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: email,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });

    return '发送成功';
  }

  async register(user: RegisterDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new BaseException('验证码已失效', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (user.captcha !== captcha) {
      throw new BaseException('验证码不正确', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new BaseException('用户已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const foundRole = await this.roleRepository.findOne({
      where: {
        id: 2,
      },
    });

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = `游客_${Math.floor(Math.random() * 10000)}`;
    newUser.roles = [foundRole];

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  private handleLoginVo(user: User) {
    const vo = new LoginVo();
    if (!user) return vo;

    vo.roles = user?.roles?.map((item) => item.name);

    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
    };

    vo.permissions = user.roles.reduce((arr, item) => {
      item.permissions.forEach((permission) => {
        if (arr.indexOf(permission) === -1) {
          arr.push(permission.code);
        }
      });
      return arr;
    }, []);

    return vo;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginDto.username,
        password: loginDto.password,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return this.handleLoginVo(user);
  }

  async refresh(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return this.handleLoginVo(user);
  }
}
