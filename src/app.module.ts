import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './systems/user/user.module';
import { RoleModule } from './systems/role/role.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { PermissionModule } from './systems/permission/permission.module';
import { Role } from './systems/role/entities/role.entity';
import { User } from './systems/user/entities/user.entity';
import { Permission } from './systems/permission/entities/permission.entity';
import { RedisModule } from './base/redis/redis.module';
import { EmailModule } from './email/email.module';
import { PublicModule } from './public/public.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './base/guard/login.guard';
import { PermissionGuard } from './base/guard/permission.guard';
import { MenuModule } from './systems/menu/menu.module';
import { Menu } from './systems/menu/entities/menu.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [Article, Category, Role, User, Menu, Permission],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
            timezone: 'Asia/Shanghai',
          },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m', // 默认 30 分钟
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    UserModule,
    RoleModule,
    CategoryModule,
    ArticleModule,
    PermissionModule,
    RedisModule,
    EmailModule,
    PublicModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
