import { Component } from '@angular/core';
import { Article } from '../article';
import { User } from '../user';
import { ArticleService } from '../article.service';
import { UserService } from '../user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { Category } from '../category';
import { CategoryService } from '../category.service';
import { PopupService } from '../popup.service';
import { SavesService } from '../saves.service';
import { StatusService } from '../status.service';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf, PageNotFoundComponent],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.scss'
})
export class ArticleDetailsComponent {

  article!: Article;
  author!: User;
  category!: Category;

  valid: boolean = false;
  access: boolean = false;
  loaded: boolean = false;

  user: User|undefined;
  
  constructor (private route: ActivatedRoute,
               private articleService: ArticleService, 
               private userService: UserService,
               private categoryService: CategoryService) {
    
    let article_id = Number(this.route.snapshot.paramMap.get('id'));

    this.articleService.any(article_id)
      .subscribe((ifAny) => {
        if (ifAny) {
          this.valid = true;

          this.articleService.byId(article_id)
            .subscribe((article) => {
              this.article = article;

              this.userService.byId(this.article.idAuthor)
                .subscribe(author => {
                  this.author = author;
                  
                  this.categoryService.byId(this.article.idCategory)
                    .subscribe(category => {
                      this.category = category;

                      this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
                      .subscribe(loggedIn => {
                        this.user = loggedIn;
                        if (loggedIn != undefined) {
                          if (loggedIn.role != 'ADMIN' && loggedIn.role != 'MODERATOR') {
                            if (this.article.idAuthor == loggedIn.id) {
                              this.access = true;
                            }
                          } else { 
                            this.access = true;
                          }
                        }
                        this.loaded = true;
                      });

                    })
                }); 
            });
        } else { this.loaded = true; }
      });
  }

  delete() {
    PopupService.acceptCallback = () => {
      let articleName = this.article.name;
      this.articleService.delete(this.article)
        .subscribe((deleted) => {
          if (deleted) {
            StatusService.crossPageStatus("Articolul a fost șters: \"" + articleName + "\"");
            window.location.replace("/articles");
          }
          else {
            StatusService.crossPageStatus("A intervenit o eroare, nu se poate șterge acest articol!");
          }
        });
      PopupService.setMessage("");
    };
    PopupService.cancelCallback = () => {};
    
    PopupService.setMessage("Sigur dorești să ștergi acest articol?");
  }

}
