import { Component } from '@angular/core';
import { Article, ArticleAttachment, ArticleValidator } from '../article';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../user.service';
import { StatusService } from '../status.service';
import { ArticleService } from '../article.service';
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
  
  valid = false;

  dummy_article: Article = 
    { id: -1, idAuthor: -1, idCategory: 1, 
      name: "Articol Nou", summary: "", 
      attachmentArray: [],
      // creationDate: new Date()
    };

  user: User|undefined;
    
  constructor (private userService: UserService,
               private articleService: ArticleService) {

    this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
      .subscribe(user => {
        this.user = user;
        if (user == undefined) return;

        this.valid = true;
        this.dummy_article.idAuthor = user.id;
      });
  }

  getUserById() {
    return this.user;
  }

  createArticle() {
    let validation = ArticleValidator.validate(this.dummy_article);
    if (validation != "OK") {
      StatusService.showStatus(validation);
      return;
    }

    this.articleService.add(this.dummy_article)
      .subscribe((articleId) => {
        window.location.replace("/article/" + articleId);
      });

  }

}
