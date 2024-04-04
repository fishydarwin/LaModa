import { Injectable } from '@angular/core';
import { Article } from './article';
import { Observable, of } from 'rxjs';
import { PagedResult } from './pagedresult';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  NULL_ARTICLE: Article = 
    { id: -1, idAuthor: -1, idCategory: -1, 
      name: '', summary: '', 
      attachmentArray: [], };
      // creationDate: new Date() };

  // saveData(): void {
  //   sessionStorage.setItem('ARTICLES', JSON.stringify(ARTICLES));
  // }

  // loadData(): void {
  //   let saveState: string | null = sessionStorage.getItem('ARTICLES');
  //   if (saveState != null) {
  //     let result: Article[] = JSON.parse(saveState);
  //     ARTICLES.splice(0, ARTICLES.length);
  //     result.forEach(article => ARTICLES.push(article))
  //   }
  // }

  constructor(private http: HttpClient) {
    // SavesService.load(this);
    // this.last_available_id = ARTICLES.length + 1;
  }

  /* READ */

  // private sortByDate(articles: Article[]) {
  //   return articles.sort(
  //     (a1, a2) => { 
  //       return a1.creation_date < a2.creation_date ? 1 : -1;
  //     });
  // }

  all(page: number = 0): Observable<PagedResult<Article>> {
    return this.http.get<PagedResult<Article>>("http://localhost:8080/article/all", {
      params: new HttpParams()
      .set('page', page - 1)
    });
  }

  any(id: number): Observable<boolean> {
    return this.http.get<boolean>(
      "http://localhost:8080/article/any", {
      params: new HttpParams()
      .set('id', id)
    });
  }

  byId(id: number): Observable<Article> {
    return this.http.get<Article>("http://localhost:8080/article/byId", {
      params: new HttpParams()
      .set('id', id)
    });
  }

  ofUser(id_author: number, page: number): Observable<PagedResult<Article>> {
    return this.http.get<PagedResult<Article>>("http://localhost:8080/article/byUser", {
      params: new HttpParams()
      .set('author', id_author)
      .set('page', page - 1)
    });
  }

  ofCategory(id_category: number, page: number): Observable<PagedResult<Article>> {
    return this.http.get<PagedResult<Article>>("http://localhost:8080/article/byCategory", {
      params: new HttpParams()
      .set('category', id_category)
      .set('page', page - 1)
    });
  }

  matchText(text: string, page: number): Observable<PagedResult<Article>> {
    return this.http.get<PagedResult<Article>>("http://localhost:8080/article/byMatchText", {
      params: new HttpParams()
      .set('text', text)
      .set('page', page - 1)
    });
  }

  /* CREATE */
  // last_available_id = 0;

  add(article: Article): Observable<number> {
    return this.http.post<number>("http://localhost:8080/article/add", article);
  }

  /* UPDATE */

  update(article: Article): Observable<number> {
    return this.http.put<number>("http://localhost:8080/article/update/" + article.id, article);
  }

  /* DELETE */
  delete(article: Article): Observable<boolean> {
    return this.http.delete<boolean>("http://localhost:8080/article/delete/" + article.id);
  }

}
