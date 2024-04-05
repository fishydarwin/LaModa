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
import { NoAccessComponent } from '../no-access/no-access.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [BaseChartDirective, NgIf, NoAccessComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {

  access: boolean = false;

  barChartData: ChartData<'bar', {key: string, value: number} []> = {
    datasets: [{
      type: 'bar',
      label: 'Numărul intrărilor',
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
      'Articole',
      'Categorii',
      'Utilizatori'
    ]
  };

  pieChartData: ChartData<'pie', {key: string, value: number} []> = {
    datasets: [{
      type: 'pie',
      label: 'Numărul intrărilor',
      data: []
    }],
    labels: [
      'Articole',
      'Categorii',
      'Utilizatori'
    ]
  };

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private userService: UserService) {
    this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
      .subscribe((user) => {
        if (user == undefined) {
          return;
        }
        if (user.role != "admin") {
          return;
        }
        this.access = true;
      });
  }

  chartState: number = 0;
  changeType() {
    this.chartState++;
    if (this.chartState > 1) this.chartState = 0;
  }

  private articles_size: number = 0;
  private categories_all: Category[]  = [];
  private users_all: User[] = [];

  ngOnInit() {

    this.articleService.all().subscribe((result) => { this.articles_size = result.size; });
    this.categoryService.all().subscribe((categories) => { this.categories_all = categories; })
    this.userService.all().subscribe((users) => { this.users_all = users; });

    this.pieChartData.datasets[0].data.push(
      {key: 'Articole', value: this.articles_size }
    );
    this.barChartData.datasets[0].data.push(
      {key: 'Articole', value: this.articles_size }
    );

    this.pieChartData.datasets[0].data.push(
      {key: 'Categorii', value: this.categories_all.length }
    );
    this.barChartData.datasets[0].data.push(
      {key: 'Categorii', value: this.categories_all.length }
    );

    this.pieChartData.datasets[0].data.push(
      {key: 'Utilizatori', value: this.users_all.length }
    );
    this.barChartData.datasets[0].data.push(
      {key: 'Utilizatori', value: this.users_all.length }
    );
  }

}
