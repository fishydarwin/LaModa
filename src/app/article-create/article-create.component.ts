import { Component } from '@angular/core';
import { Article, ArticleAttachment, ArticleValidator } from '../article';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../user.service';
import { StatusService } from '../status.service';
import { ArticleService } from '../article.service';
import { ArticlesComponent } from '../articles/articles.component';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { User } from '../user';
import { NoAccessComponent } from '../no-access/no-access.component';
import { requestUrl } from '../app.config';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [NgFor, ArticlesComponent, ArticleFormComponent, NgIf, NoAccessComponent],
  templateUrl: './article-create.component.html',
  styleUrl: './article-create.component.scss'
})
export class ArticleCreateComponent {
  
  valid = false;
  loaded = false;

  dummy_article: Article = 
    { id: -1, idAuthor: -1, idCategory: 1, 
      name: "Articol Nou", summary: "", 
      attachmentArray: [],
      // creationDate: new Date()
    };

  form_data: FormData = new FormData();

  user: User|undefined;
    
  constructor (private userService: UserService,
               private articleService: ArticleService) {

    this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
      .subscribe(user => {
        this.user = user;
        if (user == undefined) {
          this.loaded = true;
          return;
        }

        this.valid = true;
        this.dummy_article.idAuthor = user.id;
        this.loaded = true;
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

    this.articleService.uploadAttachments(this.form_data)
      .subscribe((attachmentUrls) => {

        let urls: string[] = attachmentUrls.replace("[", "").replace("]", "").split(",");
        this.dummy_article.attachmentArray.splice(0, this.dummy_article.attachmentArray.length);

        urls.forEach((elem: string) => {
          let attachment: ArticleAttachment = {
            id: -1,
            idArticle: this.dummy_article.id,
            attachmentUrl: requestUrl + "/uploads/get/" + elem.trim()
          };
          this.dummy_article.attachmentArray.push(attachment);
        })

        this.articleService.add(this.dummy_article)
          .subscribe((articleId) => {
            window.location.replace("/article/" + articleId);
          });
      })

  }

}
