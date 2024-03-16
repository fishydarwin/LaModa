import { Injectable } from '@angular/core';
import { ARTICLES } from './mock-data';
import { Article } from './article';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  NULL_ARTICLE: Article = 
    { id: -1, id_author: -1, id_category: -1, name: '', summary: '', attachment_array: [] };

  constructor() {

    let saveState: string | null = window.sessionStorage.getItem('ARTICLES');
    if (saveState != null) {
      let result: Article[] = JSON.parse(saveState);
      ARTICLES.splice(0, ARTICLES.length);
      result.forEach(article => ARTICLES.push(article))
    }

    this.last_available_id = ARTICLES.length + 1;
  }

  /* READ */

  all(): Observable<Article[]> {
    const articles = of(ARTICLES);
    return articles;
  }

  any(id: number): boolean {
    for (let i = 0; i < ARTICLES.length; i++)
      if (ARTICLES[i].id == id)
        return true;
    return false;
  }

  byId(id: number): Article {
    for (let i = 0; i < ARTICLES.length; i++)
      if (ARTICLES[i].id == id)
        return ARTICLES[i];
    return this.NULL_ARTICLE;
  }

  ofUser(id_author: number): Observable<Article[]> {
    const articles = of(ARTICLES.filter(article => article.id_author == id_author));
    return articles;
  }

  ofCategory(id_category: number): Observable<Article[]> {
    const articles = of(ARTICLES.filter(article => article.id_category == id_category));
    return articles;
  }

  /* CREATE */
  last_available_id = 0;

  add(article: Article): number {
    article.id = this.last_available_id;
    ARTICLES.push(article);
    return article.id;
  }

}
