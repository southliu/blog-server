import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PageBlogDto } from './dto/page-blog.dto';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class BlogService {
  @InjectRepository(Blog)
  private blogRepository: Repository<Blog>;

  @InjectRepository(Category)
  private categoryRepository: Repository<Category>;

  create(createBlogDto: CreateBlogDto) {
    console.log('createBlogDto:', createBlogDto);
    return 'This action adds a new blog';
  }

  findAll() {
    return `This action returns all blog`;
  }

  async findPage(param: PageBlogDto) {
    const { current, pageSize } = param;
    const skipCount = (current - 1) * pageSize;

    const [records, total] = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.categories', 'category')
      // .addSelect(['category.name'])
      .skip(skipCount)
      .take(pageSize)
      .getManyAndCount();

    // const [records, total] = await this.blogRepository.findAndCount({
    //   skip: skipCount,
    //   take: pageSize,
    //   relations: {
    //     categories: true,
    //   },
    // });

    return {
      records,
      total,
    };
  }

  // 添加数据
  async createMany() {
    const a1 = new Blog();
    a1.title = 'aaaa';
    a1.content = 'aaaaaaaaaa';
    a1.visit = 1;

    const a2 = new Blog();
    a2.title = 'bbbbbb';
    a2.content = 'bbbbbbbbbb';
    a2.visit = 1;

    const t1 = new Category();
    t1.name = 'ttt1111';

    const t2 = new Category();
    t2.name = 'ttt2222';

    const t3 = new Category();
    t3.name = 'ttt33333';

    a1.categories = [t1, t2];
    a2.categories = [t1, t2, t3];

    await this.categoryRepository.save(t1);
    await this.categoryRepository.save(t2);
    await this.categoryRepository.save(t3);
    await this.blogRepository.save(a1);
    await this.blogRepository.save(a2);

    return 'success';
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    console.log('updateBlogDto:', updateBlogDto);
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
