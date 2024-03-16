import { Component } from '@angular/core';
import { Article } from '../article';
import { User } from '../user';
import { ArticleService } from '../article.service';
import { UserService } from '../user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { Category } from '../category';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf, PageNotFoundComponent],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss'
})
export class ArticleDetailsComponent {

  article!: Article;
  user!: User;
  category!: Category;

  valid: boolean = true;

  constructor (private route: ActivatedRoute,
               private articleService: ArticleService, 
               private userService: UserService,
               private categoryService: CategoryService) {

    let article_id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (articleService.any(article_id)) {
      this.article = this.articleService.byId(article_id);
      this.user = this.userService.byId(this.article.id_author);
      this.category = this.categoryService.byId(this.article.id_category);
    }
    else {
      this.valid = false;
    }

  }

}
