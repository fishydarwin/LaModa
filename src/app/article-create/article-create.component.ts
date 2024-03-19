import { Component } from '@angular/core';
import { Article, ArticleAttachment, ArticleValidator } from '../article';
import { NgFor } from '@angular/common';
import { UserService } from '../user.service';
import { StatusService } from '../status.service';
import { ArticleService } from '../article.service';
import { ARTICLES } from '../mock-data';
import { ArticlesComponent } from '../articles/articles.component';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { SavesService } from '../saves.service';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [NgFor, ArticlesComponent, ArticleFormComponent],
  templateUrl: './article-create.component.html',
  styleUrl: './article-create.component.scss'
})
export class ArticleCreateComponent {

  dummy_article: Article = 
    // TODO: change author id from 1 to be user-aware
    { id: -1, id_author: 1, id_category: 1, 
      name: "Articol Nou", summary: "", 
      attachment_array: [],
      creation_date: new Date()
    };

  constructor (private userService: UserService,
               private articleService: ArticleService) {
  }

  getUserById() {
    // TODO: change author id from 1 to be user-aware
    return this.userService.byId(1);
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
