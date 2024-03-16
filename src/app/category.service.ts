import { Injectable } from '@angular/core';
import { CATEGORIES } from './mock-data';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  NULL_CATEGORY: Category = { id: -1, name: '', system_category: false };

  constructor() { }

  all(): Category[] {
    return CATEGORIES;
  }

  any(id: number): boolean {
    for (let i = 0; i < CATEGORIES.length; i++)
      if (CATEGORIES[i].id == id)
        return true;
    return false;
  }

  byId(id: number): Category {
    for (let i = 0; i < CATEGORIES.length; i++)
      if (CATEGORIES[i].id == id)
        return CATEGORIES[i];
    return this.NULL_CATEGORY;
  }

}
