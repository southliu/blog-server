import { Article } from 'src/article/entities/article.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'categories',
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 30,
    comment: '名称',
  })
  name: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @OneToMany(() => Article, (article) => article.categories, {
    cascade: true,
  })
  articles: Article[];
}
