import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  static paginate(who: any, page: number, elements: number) {
      let start = who.length - elements * (page + 1);
      if (start < 0) start = 0;
      return who.slice(start, who.length - elements * page);
  }
  
}
