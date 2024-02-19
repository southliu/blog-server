import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';

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
          entities: [Article, Category],
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    UserModule,
    RoleModule,
    CategoryModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
