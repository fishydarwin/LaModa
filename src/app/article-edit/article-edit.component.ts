import { Component } from '@angular/core';
import { SavesService } from '../saves.service';
import { Article, ArticleAttachment, ArticleValidator } from '../article';
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
import { requestUrl } from '../app.config';

@Component({
  selector: 'app-article-edit',
  standalone: true,
  imports: [ArticleFormComponent, ArticlesComponent, RouterLink, PageNotFoundComponent, NgIf, NoAccessComponent],
  templateUrl: './article-edit.component.html',
  styleUrl: './article-edit.component.scss'
})
export class ArticleEditComponent {

  valid: boolean = false;
  access: boolean = false;
  loaded: boolean = false;

  dummy_article: Article = 
    { id: -1, idAuthor: -1, idCategory: 1, 
      name: "Articol Nou", summary: "", 
      attachmentArray: [],
      // creationDate: new Date()
    };

  form_data: FormData = new FormData();

  user: User|undefined;

  constructor (private route: ActivatedRoute,
               private userService: UserService,
               private articleService: ArticleService) {

      let article_id = Number(this.route.snapshot.paramMap.get('id'));
      
      articleService.any(article_id)
        .subscribe((ifAny) => {
          if (ifAny) {
            this.valid = true;
            this.articleService.byId(article_id)
              .subscribe((article) => {
                this.dummy_article = article;
    
                this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
                  .subscribe(loggedIn => {
                    this.user = loggedIn;
    
                    if (loggedIn == undefined) {
                      this.loaded = true;
                      return;
                    }
            
                    if (loggedIn.role != 'MODERATOR' && loggedIn.role != 'ADMIN') {
                      if (this.dummy_article.idAuthor != loggedIn.id) {
                        this.loaded = true;
                        return;
                      }
                    }
    
                    this.access = true;

                    // this.dummy_article.idAuthor = loggedIn.id;
                    this.loaded = true;
                  });
              });
          } else { this.loaded = true; }
        })
  }

  getUserById() {
    return this.user;
  }

  editArticle() {
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

        this.articleService.update(this.dummy_article)
          .subscribe((articleId) => {
            window.location.replace("/article/" + articleId);
          });
      })
  }

}
