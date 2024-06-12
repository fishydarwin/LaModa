import { Component, Input } from '@angular/core';
import { Article, ArticleAttachment } from '../article';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss'
})
export class ArticleFormComponent {
  
  @Input({required: true, alias: 'dummy-article' }) 
  dummy_article: Article = 
  { id: -1, idAuthor: -1, idCategory: -1, 
    name: "", summary: "", attachmentArray: [] };
    // creationDate: new Date() };

  @Input({required: true, alias: 'form-data' })
  form_data: FormData = new FormData();
  private file_list: File[] = [];

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {
    this.categoryService.all()
      .subscribe(categories => this.categories = categories);
  }

  private refreshFormData() {
    this.form_data.delete("files");
    this.file_list?.forEach((fileObject: File) => {
      this.form_data.append("files", fileObject);
    });
  }

  onFileSelectionChanged(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      Array.from(fileList).forEach((elem) => this.file_list.push(elem));
      this.dummy_article.attachmentArray.splice(0, this.dummy_article.attachmentArray.length);
      this.file_list.forEach((fileObject: File) => {
        const url = window.URL.createObjectURL(fileObject);
        let attachment = {} as ArticleAttachment;
        attachment.id = -1;
        attachment.idArticle = this.dummy_article.id;
        attachment.attachmentUrl = url;
        this.dummy_article.attachmentArray.push(attachment);
      });
      this.refreshFormData();
      element.value = '';
    }
  }

  onFileRemove(event: Event, index: number) {
    this.dummy_article.attachmentArray.splice(index, 1);
    this.file_list.splice(index, 1);
    this.refreshFormData();
  }

}
