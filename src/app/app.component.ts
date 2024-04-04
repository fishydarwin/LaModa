import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ArticlesComponent } from './articles/articles.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { StatusService } from './status.service';
import { PopupComponent } from './popup/popup.component';
import { UserService } from './user.service';
import { User } from './user';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ArticlesComponent, FormsModule, NgIf, PopupComponent, NgxPaginationModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'laModă';
  searchText = "";
  
  user: User|undefined;

  constructor(private userService: UserService) {
    this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
      .subscribe((user) => this.user = user);
  }

  hasStatus(): boolean {
    return StatusService.has();
  }

  getStatus(): string {
    return StatusService.get();
  }

  search() {
    let trimmed = this.searchText.trim();
    if (trimmed.length > 0)
      window.location.href = "/articles/search/" + trimmed; 
      //TODO: future warning: avoid injection!
  }

  static paginate(who: any, page: number, elements: number) {
    let start = who.length - elements * page;
    if (start < 0) start = 0;
    return who.slice(start, who.length - elements * (page - 1));
  }

}
