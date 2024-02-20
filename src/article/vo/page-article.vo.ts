import { Article } from '../entities/article.entity';

export class ArticlePageVo extends Article {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  date: string;
}
