import { Component, Input, numberAttribute } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';
import { UserService } from '../user.service';
import { User } from '../user';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CompatClient, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
  users: { [id: number] : User } = {};

  loaded: boolean = false;

  constructor(private articleService: ArticleService, 
              private userService: UserService) {
                
    //TODO: HOTFIX: temporary
    this.userService.all()
      .subscribe((users) => {
        users.forEach(user => {
          this.users[user.id] = user;
        })
      });

    if (this.dummy_article == null) {
      articleService.subscribeToSocket(this, () => this.getArticles() );
    }
  }

  ngOnInit() {
    this.getArticles();
  }

  private filledDummyArticle = false;
  getArticles(): void {
    
    if (this.dummy_article != null) {
      if (!this.filledDummyArticle) {
        this.articles.push(this.dummy_article);
        this.filledDummyArticle = true;
        this.loaded = true;
      }
    }
    else if (this.id_category > 0) {
      this.articleService.ofCategory(this.id_category, this.current_page)
        .subscribe((result) => {
          this.articles = result.result;
          this.total = result.size;
          this.loaded = true;
        });
    }
    else if (this.match_text.length > 0) {
      this.articleService.matchText(this.match_text, this.current_page)
        .subscribe((result) => {
          this.articles = result.result;
          this.total = result.size;
          this.loaded = true;
        });
    }
    else if (this.id_author <= 0) {
      this.articleService.all(this.current_page)
        .subscribe((result) => {
          this.articles = result.result;
          this.total = result.size;
          this.loaded = true;
        });
    }
    else {
      this.articleService.ofUser(this.id_author, this.current_page)
      .subscribe((result) => {
        this.articles = result.result;
        this.total = result.size;
        this.loaded = true;
      });
    }
  }

  getUserById(id: number): User {
    return this.users[id];
  }

  updatePage(page: number): void {
    this.current_page = page;
    this.getArticles();
    window.scroll(0, 0);
  }

}

