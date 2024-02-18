import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'blogs',
})
export class Blog {
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

  @ManyToMany(() => Category, (category) => category.blogs)
  @JoinTable({
    name: 'blog_category',
  })
  categories: Category[];
}
