import { Component } from '@angular/core';
import { ArticleService } from '../article.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { CategoryService } from '../category.service';
import { UserService } from '../user.service';
import { Article } from '../article';
import { User } from '../user';
import { Category } from '../category';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [BaseChartDirective, NgIf],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {

  barChartData: ChartData<'bar', {key: string, value: number} []> = {
    datasets: [{
      type: 'bar',
      label: 'Number of Entries',
      data: [],
      backgroundColor: [
        '#36a2eb',
        '#ff6383',
        '#fe9e40'
      ],
      parsing: {
        xAxisKey: 'key',
        yAxisKey: 'value'
      }
    }],
    labels: [
      'Articles',
      'Categories',
      'Users'
    ]
  };

  pieChartData: ChartData<'pie', {key: string, value: number} []> = {
    datasets: [{
      type: 'pie',
      label: 'Number of Entries',
      data: []
    }],
    labels: [
      'Articles',
      'Categories',
      'Users'
    ]
  };

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private userService: UserService) {
  }

  chartState: number = 0;
  changeType() {
    this.chartState++;
    if (this.chartState > 1) this.chartState = 0;
  }


  private articles_all: Article[] = [];
  private categories_all: Category[]  = [];
  private users_all: User[] = [];

  ngOnInit() {
    //TODO: user-context

    this.articleService.all().subscribe((articles) => { this.articles_all = articles; });
    this.categories_all = this.categoryService.all();
    this.userService.all().subscribe((users) => { this.users_all = users; });

    this.pieChartData.datasets[0].data.push(
      {key: 'Articles', value: this.articles_all.length }
    );
    this.barChartData.datasets[0].data.push(
      {key: 'Articles', value: this.articles_all.length }
    );

    this.pieChartData.datasets[0].data.push(
      {key: 'Categories', value: this.categories_all.length }
    );
    this.barChartData.datasets[0].data.push(
      {key: 'Categories', value: this.categories_all.length }
    );

    this.pieChartData.datasets[0].data.push(
      {key: 'Users', value: this.users_all.length }
    );
    this.barChartData.datasets[0].data.push(
      {key: 'Users', value: this.users_all.length }
    );
  }

}
