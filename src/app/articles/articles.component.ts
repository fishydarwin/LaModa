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

  constructor(private articleService: ArticleService, 
              private userService: UserService) {
                
    //TODO: HOTFIX: temporary
    this.userService.all()
      .subscribe((users) => {
        users.forEach(user => {
          this.users[user.id] = user;
        })
      });

    this.initUpdateSocket();
  }

  ngOnInit() {
    this.getArticles();
  }

  getArticles(): void {
    
    if (this.dummy_article != null) {
      this.articles.push(this.dummy_article);
    }
    else if (this.id_category > 0) {
      this.articleService.ofCategory(this.id_category, this.current_page)
        .subscribe((result) => {
          this.articles = result.result;
          this.total = result.size;
        });
    }
    else if (this.match_text.length > 0) {
      this.articleService.matchText(this.match_text, this.current_page)
        .subscribe((result) => {
          this.articles = result.result;
          this.total = result.size;
        });
    }
    else if (this.id_author <= 0) {
      this.articleService.all(this.current_page)
        .subscribe((result) => {
          this.articles = result.result;
          this.total = result.size;
        });
    }
    else {
      this.articleService.ofUser(this.id_author, this.current_page)
      .subscribe((result) => {
        this.articles = result.result;
        this.total = result.size;
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
  
  /* WEBSOCKET UPDATE */

  private stompClient: CompatClient = Stomp.client("ws://localhost:8080/ws");
  private lastUpdateTimeStamp: number = Date.now().valueOf();

  makeUpdateSocket() {
    
    this.stompClient.onConnect = (frame) => {
        this.stompClient.subscribe('/article', (result) => {
          if (this.lastUpdateTimeStamp < JSON.parse(result.body)) {
            this.getArticles();
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
  
  requestUpdateSocket() {
    if (this.stompClient == null) return;
    this.stompClient.publish({
      destination: "/app/article-time",
      body: "{}"
    });
  }

  initUpdateSocket() {
    this.makeUpdateSocket();

    setInterval(() => {
      this.requestUpdateSocket();
    }, 8000);
  }

}

