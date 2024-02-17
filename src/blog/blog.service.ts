import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PageBlogDto } from './dto/page-blog.dto';

@Injectable()
export class BlogService {
  create(createBlogDto: CreateBlogDto) {
    console.log('createBlogDto:', createBlogDto);
    return 'This action adds a new blog';
  }

  findAll() {
    return `This action returns all blog`;
  }

  findPage(param: PageBlogDto) {
    console.log('page:', param);

    return param;
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
