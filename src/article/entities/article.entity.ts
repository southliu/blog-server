import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'articles',
})
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    comment: '标题',
  })
  title: string;

  @Column({
    length: 500,
    comment: '内容',
  })
  content: string;

  @Column({
    comment: '阅读量',
  })
  visit: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => Category, (category) => category.articles, {
    onDelete: 'CASCADE',
  })
  categories: Category;
}
