import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { StatusService } from '../status.service';
import { SavesService } from '../saves.service';
import { NgIf } from '@angular/common';
import { NoAccessComponent } from '../no-access/no-access.component';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [FormsModule, NgIf, NoAccessComponent],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent {

  valid: boolean = false;

  email: string = "";
  password: string = "";

  constructor(private userService: UserService) {
    this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
      .subscribe((user) => {
        if (user == undefined) {
          this.valid = true;
        }
      });
  }

  login(): void {
    this.userService.idByDetails(this.email, this.password)
      .subscribe(userId => {

        if (userId <= 0) {
          StatusService.showStatus("Adresa de e-mail sau parola nu sunt corecte.");
          return;
        }

        this.userService.byId(userId)
          .subscribe((user) => {
            user.passwordObfuscated = this.password;
            this.userService.generateSession(user)
              .subscribe((sessionToken) => {
                window.sessionStorage.setItem("USER_SESSION_TOKEN", sessionToken);
                window.location.replace("/articles");
              });
            
          });
          
      })
  }

}
