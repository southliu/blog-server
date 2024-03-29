import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  @InjectRepository(Category)
  private categoryRepository: Repository<Category>;

  create(createCategoryDto: CreateCategoryDto) {
    console.log('createCategoryDto:', createCategoryDto);
    return 'This action adds a new category';
  }

  async findAll() {
    const result = await this.categoryRepository
      .createQueryBuilder()
      .select(['id', 'name', 'icon'])
      .getRawMany();

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  getTopCategory() {
    const list = this.categoryRepository
      .createQueryBuilder()
      .select(['id', 'name'])
      .skip(1)
      .take(10)
      .addOrderBy('createTime', 'DESC')
      .getRawMany();

    return list;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    console.log('updateCategoryDto:', updateCategoryDto);
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
