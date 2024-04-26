import { Injectable } from '@angular/core';
import { Article, ArticleAttachment } from './article';
import { Observable, of } from 'rxjs';
import { PagedResult } from './pagedresult';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { OfflineEntityTracker } from './offline-entity-tracker';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  NULL_ARTICLE: Article = 
    { id: -1, idAuthor: -1, idCategory: -1, 
      name: '', summary: '', 
      attachmentArray: [], };
      // creationDate: new Date() };

  // the voodoo here is off the charts...
  private offlineTracker: OfflineEntityTracker<Article, number> =
    new OfflineEntityTracker<Article, number>()
      .withSessionStorageSaveName("articles")

      .withEntityGetId((article) => article.id)
      .withEntitySetId((article, id) => {
        let newArticle = article;
        newArticle.id = id;
        return newArticle;
      })

      .withInitialOfflineId(-1)
      .withOfflineIdUpdateCall((id) => id!--)

      .withAddOperation((article) => this.add(article).subscribe())
      .withUpdateOperation((article) => this.update(article).subscribe())
      .withDeleteOperation((article) => this.delete(article).subscribe());

  tracker(): OfflineEntityTracker<Article, number> {
    return this.offlineTracker;
  }

  constructor(private http: HttpClient) {
    this.initUpdateSocket();
  }

  /* READ */

  // private sortByDate(articles: Article[]) {
  //   return articles.sort(
  //     (a1, a2) => { 
  //       return a1.creation_date < a2.creation_date ? 1 : -1;
  //     });
  // }

  all(page: number = 0): Observable<PagedResult<Article>> {
    if (!this.offlineTracker.internetAvailable()) {
      let all = Array.from(this.offlineTracker.serveCachedAll());
      let cachedResult: PagedResult<Article> = {
        result: all,
        size: all.length
      }
      return of(cachedResult);
    }
    
    return this.http.get<PagedResult<Article>>("http://localhost:8080/article/all", {
      params: new HttpParams()
      .set('page', page - 1)
    });
  }

  any(id: number): Observable<boolean> {
    if (!this.offlineTracker.internetAvailable()) {
      return of(this.offlineTracker.isCachedId(id));
    }
    
    return this.http.get<boolean>(
      "http://localhost:8080/article/any", {
      params: new HttpParams()
      .set('id', id)
    });
  }

  byId(id: number): Observable<Article> {
    if (!this.offlineTracker.internetAvailable()) {
      let article = this.offlineTracker.serveCached(id);
      if (article == null) return of();
      return of(article);
    }

    return this.http.get<Article>("http://localhost:8080/article/byId", {
      params: new HttpParams()
      .set('id', id)
    });
  }

  ofUser(id_author: number, page: number): Observable<PagedResult<Article>> {
    if (!this.offlineTracker.internetAvailable()) {
      let all = Array.from(this.offlineTracker.serveCachedAll());
      let filtered = [];
      for (let article of all) {
        if (article.idAuthor == id_author) {
          filtered.push(article);
        }
      }
      let cachedResult: PagedResult<Article> = {
        result: filtered,
        size: filtered.length
      }
      return of(cachedResult);
    }

    return this.http.get<PagedResult<Article>>("http://localhost:8080/article/byUser", {
      params: new HttpParams()
      .set('author', id_author)
      .set('page', page - 1)
    });
  }

  ofCategory(id_category: number, page: number): Observable<PagedResult<Article>> {
    if (!this.offlineTracker.internetAvailable()) {
      let all = Array.from(this.offlineTracker.serveCachedAll());
      let filtered = [];
      for (let article of all) {
        if (article.idCategory == id_category) {
          filtered.push(article);
        }
      }
      let cachedResult: PagedResult<Article> = {
        result: filtered,
        size: filtered.length
      }
      return of(cachedResult);
    }

    return this.http.get<PagedResult<Article>>("http://localhost:8080/article/byCategory", {
      params: new HttpParams()
      .set('category', id_category)
      .set('page', page - 1)
    });
  }

  matchText(text: string, page: number): Observable<PagedResult<Article>> {
    if (!this.offlineTracker.internetAvailable()) {
      let all = Array.from(this.offlineTracker.serveCachedAll());
      let filtered = [];
      for (let article of all) {
        if (article.name.includes(text)) {
          filtered.push(article);
        }
      }
      let cachedResult: PagedResult<Article> = {
        result: filtered,
        size: filtered.length
      }
      return of(cachedResult);
    }

    return this.http.get<PagedResult<Article>>("http://localhost:8080/article/byMatchText", {
      params: new HttpParams()
      .set('text', text)
      .set('page', page - 1)
    });
  }

  /* CREATE */
  // last_available_id = 0;

  add(article: Article): Observable<number> {
    if (!this.offlineTracker.internetAvailable()) {
      let offlineId = this.offlineTracker.cache(article);
      if (offlineId == null) return of();
      this.offlineTracker.addEntity(article);
      return of(offlineId);
    }
    this.requestUpdateSocket();
    return this.http.post<number>("http://localhost:8080/article/add", article);
  }

  /* UPDATE */

  update(article: Article): Observable<number> {
    if (!this.offlineTracker.internetAvailable()) {
      if (this.offlineTracker.isCached(article)) {
        this.offlineTracker.updateEntity(article);
        return of(this.offlineTracker.serveCached(article.id)!.id);
      } else {
        return of();
      }
    }
    this.requestUpdateSocket();
    return this.http.put<number>("http://localhost:8080/article/update/" + article.id, article);
  }

  /* DELETE */
  delete(article: Article): Observable<boolean> {
    if (!this.offlineTracker.internetAvailable()) {
      if (this.offlineTracker.isCached(article)) {
        this.offlineTracker.deleteEntity(article);
        return of(this.offlineTracker.destroy(article.id));
      }
      return of(false);
    }
    this.requestUpdateSocket();
    return this.http.delete<boolean>("http://localhost:8080/article/delete/" + article.id);
  }

  /* WEBSOCKET UPDATE */

  private stompClient: CompatClient = Stomp.client("ws://localhost:8080/ws");
  private lastUpdateTimeStamp: number = Date.now().valueOf();

  private callableMap: Map<any, Function> = new Map<any, Function>();

  private makeUpdateSocket() {
    
    this.stompClient.onConnect = () => {
        this.stompClient.subscribe('/article', (result) => {
          if (this.lastUpdateTimeStamp < JSON.parse(result.body)) {
            this.callableMap.forEach((value, key) => { value.call(key); })
          }
        });
    };
    
    this.stompClient.onWebSocketError = (error) => {
        console.error('Error with update websocket', error);
    };
    
    this.stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }
  
  private requestUpdateSocket() {
    if (this.stompClient == null) return;
    this.stompClient.publish({
      destination: "/app/article-time",
      body: "{}"
    });
  }

  private initUpdateSocket() {
    this.makeUpdateSocket();
  }

  subscribeToSocket(self: any, callable: Function) {
    this.callableMap.set(self, callable);
  }

}
