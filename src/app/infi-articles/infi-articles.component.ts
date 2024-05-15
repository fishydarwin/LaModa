import { Component } from '@angular/core';
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
  templateUrl: './infi-articles.component.html',
  styleUrl: './infi-articles.component.scss'
})
export class InfiArticlesComponent {

  current_page: number = 1;
  total: number = 0;

  articles: Article[] = [];
  users: { [id: number] : User } = {};

  loaded: boolean = false;

  constructor(private articleService: ArticleService, 
              private userService: UserService) {

    this.userService.all()
      .subscribe((users) => {
        users.forEach(user => {
          this.users[user.id] = user;
        })
      });
  }

  private pageHeight() {
    let body = document.body,
        html = document.documentElement;

    return Math.max(body.scrollHeight, body.offsetHeight, 
                    html.clientHeight, html.scrollHeight, 
                    html.offsetHeight);
  }

  private bottomUpdateOffset: number = 800;
  private isAtBottom() {
    return (window.innerHeight + Math.round(window.scrollY) + this.bottomUpdateOffset)
            >= this.pageHeight();
  }

  ngOnInit() {
    this.getArticles();
    
    window.onscroll = () => {
      if (this.loaded && this.isAtBottom()) {
          this.updatePage(++this.current_page);
      }
    };
  }

  getArticles(): void {
    this.loaded = false;
    this.articleService.all(this.current_page)
      .subscribe((result) => {
        result.result.forEach((elem) => { this.articles.push(elem) }); // ... ok
        this.total += result.size;
        this.loaded = true;
      });
  }

  getUserById(id: number): User {
    return this.users[id];
  }

  updatePage(page: number): void {
    this.current_page = page;
    this.getArticles();
  }

}
