import { Article } from '../entities/article.entity';

export interface ArticlePageResult extends Omit<Article, 'categories'> {
  categoryName: string;
}
