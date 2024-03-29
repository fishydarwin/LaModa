import { Component, Input, numberAttribute } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { UserService } from '../user.service';
import { User } from '../user';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf, NgxPaginationModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {

  current_page: number = 1;
  total: number = 1;

  @Input( {required: false, transform: numberAttribute, alias: 'id-author' }) 
  id_author: number = -1;

  @Input( {required: false, transform: numberAttribute, alias: 'id-category' }) 
  id_category: number = -1;

  @Input( {required: false, alias: 'dummy-article' }) 
  dummy_article?: Article;

  @Input( {required: false, alias: 'match-text' }) 
  match_text: string = "";

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
      this.articleService.ofCategory(this.id_category, this.current_page)
        .subscribe((articles: Article[]) => this.articles = articles);
      this.total = this.articleService.sizeOfCategory(this.id_category);
    }
    else if (this.match_text.length > 0) {
      this.articleService.matchText(this.match_text, this.current_page)
        .subscribe((articles: Article[]) => this.articles = articles);
      this.total = this.articleService.sizeOfMatchText(this.match_text);
    }
    else if (this.id_author <= 0) {
      this.articleService.all(this.current_page)
        .subscribe((articles: Article[]) => this.articles = articles);
        this.total = this.articleService.sizeAll();
    }
    else {
      this.articleService.ofUser(this.id_author, this.current_page)
        .subscribe((articles: Article[]) => this.articles = articles);
      this.total = this.articleService.sizeOfUser(this.id_author);
    }
 
  }

  getUserById(id: number): User {
    return this.userService.byId(id);
  }

  updatePage(page: number): void {
    this.current_page = page;
    this.getArticles();
    window.scroll(0, 0);
  }

}

