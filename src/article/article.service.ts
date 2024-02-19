import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { PageArticleDto } from './dto/page-article.dto';
import { ArticlePageResult } from './types/page';

@Injectable()
export class ArticleService {
  @InjectRepository(Article)
  private articleRepository: Repository<Article>;

  @InjectRepository(Category)
  private categoryRepository: Repository<Category>;

  create(createArticleDto: CreateArticleDto) {
    console.log('createArticleDto:', createArticleDto);
    return 'This action adds a new article';
  }

  async findPage(param: PageArticleDto) {
    const { current, pageSize } = param;
    const skipCount = (current - 1) * pageSize;

    const [list, total] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.categories', 'category')
      .select(['article.id', 'article.title', 'category.name'])
      .skip(skipCount)
      .take(pageSize)
      .getManyAndCount();

    const records: ArticlePageResult[] = [];

    for (let i = 0; i < list?.length; i++) {
      const item = list[i];

      const current = {
        ...item,
        categoryName: item.categories.name,
      };
      delete current.categories;

      records.push(current);
    }

    return {
      records,
      total,
    };
  }

  // 添加数据
  async createMany() {
    const a1 = new Article();
    a1.title = 'aaaa';
    a1.content = 'aaaaaaaaaa';
    a1.visit = 1;

    const a2 = new Article();
    a2.title = 'bbbbbb';
    a2.content = 'bbbbbbbbbb';
    a2.visit = 1;

    const t1 = new Category();
    t1.name = 'ttt1111';

    const t2 = new Category();
    t2.name = 'ttt2222';

    a1.categories = t1;
    a2.categories = t2;

    await this.categoryRepository.save(t1);
    await this.categoryRepository.save(t2);
    await this.articleRepository.save(a1);
    await this.articleRepository.save(a2);

    return 'success';
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    console.log('updateArticleDto:', updateArticleDto);
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
