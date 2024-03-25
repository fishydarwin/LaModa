import { Component } from '@angular/core';
import { SavesService } from '../saves.service';
import { Article, ArticleValidator } from '../article';
import { UserService } from '../user.service';
import { StatusService } from '../status.service';
import { ArticleService } from '../article.service';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ArticlesComponent } from '../articles/articles.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { NgIf } from '@angular/common';
import { NoAccessComponent } from '../no-access/no-access.component';
import { User } from '../user';

@Component({
  selector: 'app-article-edit',
  standalone: true,
  imports: [ArticleFormComponent, ArticlesComponent, RouterLink, PageNotFoundComponent, NgIf, NoAccessComponent],
  templateUrl: './article-edit.component.html',
  styleUrl: './article-edit.component.scss'
})
export class ArticleEditComponent {

  valid: boolean = true;
  access: boolean = true;

  dummy_article: Article = 
    // TODO: change author id from 1 to be user-aware
    { id: -1, id_author: -1, id_category: 1, 
      name: "Articol Nou", summary: "", 
      attachment_array: [],
      creation_date: new Date()
    };

  user(): User|undefined {
    return this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'));
  }

  constructor (private route: ActivatedRoute,
               private userService: UserService,
               private articleService: ArticleService) {

      let article_id = Number(this.route.snapshot.paramMap.get('id'));

      if (articleService.any(article_id)) {
        this.dummy_article = this.articleService.byId(article_id);

        let loggedIn = this.user();
        if (loggedIn == undefined) {
          this.access = false;
          return;
        }

        if (this.dummy_article.id_author != loggedIn.id) {
          this.access = false;
        }

        this.dummy_article.id_author = loggedIn.id;
      }
      else {
        this.valid = false;
      }
  }

  getUserById() {
    return this.user();
  }

  editArticle() {
    let validation = ArticleValidator.validate(this.dummy_article);
    if (validation != "OK") {
      StatusService.showStatus(validation);
      return;
    }

    let articleId = this.articleService.update(this.dummy_article);
    SavesService.save(this.articleService);

    window.location.replace("/article/" + articleId);
  }

}
