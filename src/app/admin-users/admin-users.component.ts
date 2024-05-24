import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { NoAccessComponent } from '../no-access/no-access.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusService } from '../status.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NoAccessComponent, FormsModule, NgIf],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {

  access: boolean = false;
  email: string = "";

  constructor(private userService: UserService) {
    this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
      .subscribe(loggedIn => {

        if (loggedIn == undefined) {
          return;
        }

        if (loggedIn.role != "ADMIN") {
          return;
        }

        this.access = true;
      });
  }

  changeModerator() {
    this.userService.changeModerator(this.email)
      .pipe(
        catchError(error => {
          StatusService.showStatus("Nu s-a putut efectua operația: Status " + error.error.status);
          return throwError(() => new Error(error));
        })
      )
      .subscribe(status => {

        if (status == false) {
          StatusService.showStatus("Nu s-a putut efectua operația. Încearcă să te autentifici din nou.");
          return;
        }

        StatusService.showStatus("Ai schimbat permisiunile utilizatorului "+ this.email + "!");
          
      })
      

  }

}
