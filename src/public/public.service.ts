import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from 'src/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { md5 } from 'src/utils/helper';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { BaseException } from 'src/utils/exception';
import { EmailService } from 'src/email/email.service';
import { EmailDto } from 'src/email/dto/email.dto';
import { Role } from 'src/role/entities/role.entity';
import { LoginVo } from './vo/login.vo';
import { Menu } from 'src/menu/entities/menu.entity';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class PublicService {
  private logger = new Logger();

  @Inject(RedisService)
  private redisService: RedisService;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

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

  async initData() {
    const user1 = new User();
    user1.username = 'south';
    user1.password = md5('south123456');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nickName = '管理员';

    const user2 = new User();
    user2.username = 'admin';
    user2.password = md5('admin123456');
    user2.email = 'yy@yy.com';
    user2.nickName = '游客-south';

    const role1 = new Role();
    role1.id = 1;
    role1.name = '管理员';

    const role2 = new Role();
    role2.id = 2;
    role2.name = '普通用户';

    const menu1 = new Menu();
    menu1.id = 1;
    menu1.type = 0;
    menu1.sortNum = 1;
    menu1.name = '系统管理';
    menu1.enable = true;

    const menu2 = new Menu();
    menu2.id = 2;
    menu2.type = 1;
    menu2.sortNum = 1;
    menu2.name = '菜单管理';
    menu2.enable = true;
    menu2.route = '/system/menu';

    const menu3 = new Menu();
    menu3.type = 2;
    menu3.sortNum = 1;
    menu3.name = '菜单管理-查看';
    menu3.enable = true;

    const menu4 = new Menu();
    menu4.type = 2;
    menu4.sortNum = 2;
    menu4.name = '菜单管理-新增';
    menu4.enable = true;

    const permission1 = new Permission();
    permission1.code = '/system';
    permission1.description = '系统管理权限';

    const permission2 = new Permission();
    permission2.code = '/system/menu';
    permission2.description = '菜单管理权限';

    const permission3 = new Permission();
    permission3.code = '/system/menu/index';
    permission3.description = '查看菜单权限';

    const permission4 = new Permission();
    permission4.code = '/system/menu/create';
    permission4.description = '新增菜单权限';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2, permission3, permission4];
    role2.permissions = [permission1, permission2, permission3, permission4];

    permission1.menus = [menu1];
    permission2.menus = [menu2];
    permission3.menus = [menu3];
    permission4.menus = [menu4];

    menu2.parent = menu1;
    menu3.parent = menu2;
    menu4.parent = menu2;

    await this.menuRepository.save([menu1, menu2, menu3, menu4]);
    await this.permissionRepository.save([
      permission1,
      permission2,
      permission3,
      permission4,
    ]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);

    return 'success';
  }
}
