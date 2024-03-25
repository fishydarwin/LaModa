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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ArticlesComponent, FormsModule, NgIf, PopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'laModă';

  constructor(private userService: UserService) {}

  hasStatus(): boolean {
    return StatusService.has();
  }

  getStatus(): string {
    return StatusService.get();
  }
  
  user(): User|undefined {
    return this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'));
  }
}
