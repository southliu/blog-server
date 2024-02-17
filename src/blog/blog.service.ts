import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PageBlogDto } from './dto/page-blog.dto';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlogService {
  @InjectRepository(Blog)
  private blogRepository: Repository<Blog>;

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

    const [records, total] = await this.blogRepository.findAndCount({
      skip: skipCount,
      take: pageSize,
    });

    return {
      records,
      total,
    };
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
