import { Component } from '@angular/core';
import { Category } from '../category';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../category.service';
import { NgIf } from '@angular/common';
import { ArticlesComponent } from '../articles/articles.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [NgIf, ArticlesComponent, PageNotFoundComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  category!: Category;
  valid: boolean = false;
  loaded: boolean = false;

  constructor (private route: ActivatedRoute,
               private categoryService: CategoryService) {

    let category_id = Number(this.route.snapshot.paramMap.get('id'));

    categoryService.any(category_id)
      .subscribe((ifAny) => {
        if (ifAny) {
          this.valid = true;
          this.categoryService.byId(category_id)
            .subscribe(category => { this.category = category; this.loaded = true; })
        } else { this.loaded = true; }
      })
  }
}
