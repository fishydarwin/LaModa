import { Injectable } from '@angular/core';
import { Category } from './category';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  NULL_CATEGORY: Category = { id: -1, name: '', systemCategory: false };

  constructor(private http: HttpClient) { }

  all(): Observable<Category[]> {
    return this.http.get<Category[]>("http://localhost:8080/category/all");
  }

  any(id: number): Observable<boolean> {
    return this.http.get<boolean>(
      "http://localhost:8080/category/any", {
      params: new HttpParams()
      .set('id', id)
    });
  }

  byId(id: number): Observable<Category> {
    return this.http.get<Category>("http://localhost:8080/category/byId", {
      params: new HttpParams()
      .set('id', id)
    });
  }

}
