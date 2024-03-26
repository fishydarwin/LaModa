import { Component } from '@angular/core';
import { ArticlesComponent } from '../articles/articles.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-articles-search',
  standalone: true,
  imports: [ArticlesComponent],
  templateUrl: './articles-search.component.html',
  styleUrl: './articles-search.component.scss'
})
export class ArticlesSearchComponent {

  match_title: string = "";

  constructor(private route: ActivatedRoute) {
    let match_title = this.route.snapshot.paramMap.get('text');
    if (match_title != null) this.match_title = match_title;
  }

}
