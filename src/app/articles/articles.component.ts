import { Component, Input, numberAttribute } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { UserService } from '../user.service';
import { User } from '../user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {

  @Input( {required: false, transform: numberAttribute, alias: 'id-author' }) 
  id_author: number = -1;

  @Input( {required: false, transform: numberAttribute, alias: 'id-category' }) 
  id_category: number = -1;

  @Input( {required: false, alias: 'dummy-article' }) 
  dummy_article?: Article;

  @Input( {required: false, alias: 'match-title' }) 
  match_title: string = "";

  articles: Article[] = [];

  constructor(private articleService: ArticleService, 
              private userService: UserService) {}

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles(): void {
    
    if (this.dummy_article != null) {
      this.articles.push(this.dummy_article);
    }
    else if (this.id_category > 0) {
      this.articleService.ofCategory(this.id_category)
        .subscribe((articles: Article[]) => this.articles = articles);
    }
    else if (this.match_title.length > 0) {
      this.articleService.matchName(this.match_title)
        .subscribe((articles: Article[]) => this.articles = articles);
    }
    else if (this.id_author <= 0) {
      this.articleService.all()
        .subscribe((articles: Article[]) => this.articles = articles);
    }
    else {
      this.articleService.ofUser(this.id_author)
        .subscribe((articles: Article[]) => this.articles = articles);
    }
 
  }

  getUserById(id: number): User {
    return this.userService.byId(id);
  }

}

