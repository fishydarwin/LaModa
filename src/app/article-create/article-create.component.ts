import { Component } from '@angular/core';
import { Article, ArticleAttachment } from '../article';
import { NgFor } from '@angular/common';
import { UserService } from '../user.service';
import { CategoryService } from '../category.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../category';
import { StatusService } from '../status.service';
import { ArticleService } from '../article.service';
import { ARTICLES } from '../mock-data';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './article-create.component.html',
  styleUrl: './article-create.component.scss'
})
export class ArticleCreateComponent {
  dummy_article: Article = 
    // TODO: change author id from 1 to be user-aware
    { id: -1, id_author: 1, id_category: 1, 
      name: "Articol Nou", summary: "", 
      attachment_array: []};

  categories: Category[] = [];

  constructor (private userService: UserService,
               private categoryService: CategoryService,
               private statusService: StatusService,
               private articleService: ArticleService) {
  }

  ngOnInit() {
    this.categories = this.categoryService.all();
  }

  onFileSelectionChanged(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      Array.from(fileList).forEach((fileObject: File) => {
        const url = window.URL.createObjectURL(fileObject);
        let attachment = {} as ArticleAttachment;
        attachment.attachment_url = url;
        this.dummy_article.attachment_array.push(attachment);
      });
      element.value = '';
    }
  }

  onFileRemove(event: Event, index: number) {
    this.dummy_article.attachment_array.splice(index, 1);
  }

  getUserById() {
    // TODO: change author id from 1 to be user-aware
    return this.userService.byId(1);
  }

  createArticle() {
    if (this.dummy_article.name.trim().length <= 0) {
      this.statusService.showStatus("Vă rugăm să introduceți numele articolului.");
      return;
    }
    if (this.dummy_article.summary.trim().length <= 0) {
      this.statusService.showStatus("Vă rugăm să introduceți descrierea articolului.");
      return;
    }
    if (this.dummy_article.attachment_array.length <= 0) {
      this.statusService.showStatus("Trebuie să adaugați cel putin o imagine în articolul dvs.");
      return;
    }

    let articleId = this.articleService.add(this.dummy_article);
    window.sessionStorage.setItem('ARTICLES', JSON.stringify(ARTICLES));

    window.location.replace("/article/" + articleId);
  }

}
