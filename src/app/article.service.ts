import { Injectable } from '@angular/core';
import { ARTICLES } from './mock-data';
import { Article } from './article';
import { Observable, of } from 'rxjs';
import { Savable } from './savable';
import { SavesService } from './saves.service';
import { AppComponent } from './app.component';

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
    sessionStorage.setItem('ARTICLES', JSON.stringify(ARTICLES));
  }

  loadData(): void {
    let saveState: string | null = sessionStorage.getItem('ARTICLES');
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

  all(page: number = 0): Observable<Article[]> {
    if (page <= 0) {
      const articles = of(this.sortByDate(ARTICLES));
      return articles;
    }
    const articles = of(this.sortByDate(AppComponent.paginate(ARTICLES, page, 9)));
    return articles;
  }

  sizeAll(): number {
    return ARTICLES.length;
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

  ofUser(id_author: number, page: number): Observable<Article[]> {
    const articles = of(
      this.sortByDate(AppComponent.paginate(ARTICLES.filter(article => article.id_author == id_author), page, 9))
    );
    return articles;
  }

  sizeOfUser(id_author: number): number {
    return ARTICLES.filter(article => article.id_author == id_author).length;
  }

  ofCategory(id_category: number, page: number): Observable<Article[]> {
    const articles = of(
      this.sortByDate(AppComponent.paginate(ARTICLES.filter(article => article.id_category == id_category), page, 9))
    );
    return articles;
  }

  sizeOfCategory(id_category: number): number {
    return ARTICLES.filter(article => article.id_category == id_category).length;
  }

  matchText(text: string, page: number): Observable<Article[]> {
    const articles = of(
      this.sortByDate(AppComponent.paginate(ARTICLES.filter(
        article => 
        article.name.toLowerCase().includes(text.toLowerCase()) ||
        article.summary.toLowerCase().includes(text.toLowerCase())
      ), page, 9))
    );
    return articles;
  }

  sizeOfMatchText(text: string): number {
    return ARTICLES.filter(
      article => 
      article.name.toLowerCase().includes(text.toLowerCase()) ||
      article.summary.toLowerCase().includes(text.toLowerCase())
    ).length;
  }

  /* CREATE */
  last_available_id = 0;

  add(article: Article): number {
    article.id = ++this.last_available_id;
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
