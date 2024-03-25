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

  valid: boolean = true;
  access: boolean = true;

  user(): User|undefined {
    return this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'));
  }
  
  constructor (private route: ActivatedRoute,
               private articleService: ArticleService, 
               private userService: UserService,
               private categoryService: CategoryService) {

    let article_id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (articleService.any(article_id)) {
      this.article = this.articleService.byId(article_id);
      this.author = this.userService.byId(this.article.id_author);
      this.category = this.categoryService.byId(this.article.id_category);

      let loggedIn = this.user();
      if (loggedIn != undefined) {
        if (this.article.id_author != loggedIn.id) {
          this.access = false;
        }
      }
    }
    else {
      this.valid = false;
    }

  }

  delete() {
    PopupService.acceptCallback = () => {
      let articleName = this.article.name;
      let deleted = this.articleService.delete(this.article);
      if (deleted) {
        SavesService.save(this.articleService);

        StatusService.crossPageStatus("Articolul a fost șters: \"" + articleName + "\"");
        window.location.replace("/articles");
      }
      else {
        StatusService.crossPageStatus("A intervenit o eroare, nu se poate șterge acest articol!");
      }
      PopupService.setMessage("");
    };
    PopupService.cancelCallback = () => {};
    
    PopupService.setMessage("Sigur dorești să ștergi acest articol?");
  }

}
