import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import { NgIf } from '@angular/common';
import { ArticlesComponent } from '../articles/articles.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [NgIf, ArticlesComponent, PageNotFoundComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  user!: User;
  valid: boolean = true;
  access: boolean = false;

  constructor (private route: ActivatedRoute,
               private userService: UserService) {

    let user_id = Number(this.route.snapshot.paramMap.get('id'));
    if (userService.any(user_id)) {
      this.user = this.userService.byId(user_id);

      let loggedIn = this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'));
      if (loggedIn != undefined) {
        if (loggedIn.id == user_id) {
          this.access = true;
        }
      }
    }
    else {
      this.valid = false;
    }
  }

  logout(): void {
    PopupService.acceptCallback = () => {
      window.sessionStorage.removeItem("USER_SESSION_TOKEN");
      window.location.href = "/articles";
    };
    PopupService.cancelCallback = () => {};
    PopupService.setMessage("Sigur dorești să ieși din cont?")
  }
}
