import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  create(createCategoryDto: CreateCategoryDto) {
    console.log('createCategoryDto:', createCategoryDto);
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    console.log('updateCategoryDto:', updateCategoryDto);
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
