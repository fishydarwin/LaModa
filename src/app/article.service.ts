import { Injectable } from '@angular/core';
import { ARTICLES } from './mock-data';
import { Article } from './article';
import { Observable, of } from 'rxjs';
import { Savable } from './savable';
import { SavesService } from './saves.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService implements Savable {

  NULL_ARTICLE: Article = 
    { id: -1, id_author: -1, id_category: -1, 
      name: '', summary: '', 
      attachment_array: [], 
      creation_date: new Date() };

  saveData(): void {
    window.sessionStorage.setItem('ARTICLES', JSON.stringify(ARTICLES));
  }

  loadData(): void {
    let saveState: string | null = window.sessionStorage.getItem('ARTICLES');
    if (saveState != null) {
      let result: Article[] = JSON.parse(saveState);
      ARTICLES.splice(0, ARTICLES.length);
      result.forEach(article => ARTICLES.push(article))
    }
  }

  constructor() {
    SavesService.load(this);
    this.last_available_id = ARTICLES.length + 1;
  }

  /* READ */

  private sortByDate(articles: Article[]) {
    return articles.sort(
      (a1, a2) => { 
        return a1.creation_date < a2.creation_date ? 1 : -1;
      });
  }

  all(): Observable<Article[]> {
    const articles = of(this.sortByDate(ARTICLES));
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
    const articles = of(
      this.sortByDate(ARTICLES.filter(article => article.id_author == id_author))
    );
    return articles;
  }

  ofCategory(id_category: number): Observable<Article[]> {
    const articles = of(
      this.sortByDate(ARTICLES.filter(article => article.id_category == id_category))
    );
    return articles;
  }

  /* CREATE */
  last_available_id = 0;

  add(article: Article): number {
    article.id = this.last_available_id;
    this.last_available_id++;
    ARTICLES.push(article);
    return article.id;
  }

  /* UPDATE */

  update(article: Article): number {
    let index = ARTICLES.findIndex((a) => a.id == article.id);
    ARTICLES[index] = article;
    return article.id;
  }

  /* DELETE */
  delete(article: Article): boolean {
    let index = ARTICLES.findIndex((a) => a.id == article.id);
    if (index < 0) {
      return false;
    }
    ARTICLES.splice(index, 1);
    return true;
  }

}
