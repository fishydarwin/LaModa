import { Injectable } from '@angular/core';
import { Category } from './category';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { requestUrl } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  NULL_CATEGORY: Category = { id: -1, name: '', systemCategory: false };

  constructor(private http: HttpClient) { }

  all(): Observable<Category[]> {
    return this.http.get<Category[]>(requestUrl + "/category/all");
  }

  any(id: number): Observable<boolean> {
    return this.http.get<boolean>(
      requestUrl + "/category/any", {
      params: new HttpParams()
      .set('id', id)
    });
  }

  byId(id: number): Observable<Category> {
    return this.http.get<Category>(requestUrl + "/category/byId", {
      params: new HttpParams()
      .set('id', id)
    });
  }

}
