import { Component } from '@angular/core';
import { Article, ArticleAttachment, ArticleValidator } from '../article';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../user.service';
import { StatusService } from '../status.service';
import { ArticleService } from '../article.service';
import { ARTICLES } from '../mock-data';
import { ArticlesComponent } from '../articles/articles.component';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { SavesService } from '../saves.service';
import { User } from '../user';
import { NoAccessComponent } from '../no-access/no-access.component';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [NgFor, ArticlesComponent, ArticleFormComponent, NgIf, NoAccessComponent],
  templateUrl: './article-create.component.html',
  styleUrl: './article-create.component.scss'
})
export class ArticleCreateComponent {
  
  valid = true;

  dummy_article: Article = 
    { id: -1, id_author: -1, id_category: 1, 
      name: "Articol Nou", summary: "", 
      attachment_array: [],
      creation_date: new Date()
    };

  user(): User|undefined {
    return this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'));
  }
    
  constructor (private userService: UserService,
               private articleService: ArticleService) {

    let user = this.user();
    if (user == undefined) {
      this.valid = false;
      return;
    }

    this.dummy_article.id_author = user.id;
  }

  getUserById() {
    return this.user();
  }

  createArticle() {
    let validation = ArticleValidator.validate(this.dummy_article);
    if (validation != "OK") {
      StatusService.showStatus(validation);
      return;
    }

    let articleId = this.articleService.add(this.dummy_article);
    SavesService.save(this.articleService);

    window.location.replace("/article/" + articleId);
  }

}
