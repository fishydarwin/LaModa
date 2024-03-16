import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import { NgIf } from '@angular/common';
import { ArticlesComponent } from '../articles/articles.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

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

  constructor (private route: ActivatedRoute,
               private userService: UserService) {

    let user_id = Number(this.route.snapshot.paramMap.get('id'));
    if (userService.any(user_id)) {
      this.user = this.userService.byId(user_id);
    }
    else {
      this.valid = false;
    }
  }
}
