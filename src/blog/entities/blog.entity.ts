import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'roles',
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
    length: 10,
    comment: '阅读量',
  })
  visit: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
