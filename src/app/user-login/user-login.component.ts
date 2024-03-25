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

  valid: boolean = true;

  email: string = "";
  password: string = "";

  constructor(private userService: UserService) {
    let user = this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'));
    if (user != undefined) {
      this.valid = false;
    }
  }

  login(): void {
    let userId = this.userService.idByDetails(this.email, this.password) //TODO: obfuscate password
    
    if (userId <= 0) {
      StatusService.showStatus("Adresa de e-mail sau parola nu sunt corecte.");
      return;
    }
    
    let user = this.userService.byId(userId);
    let sessionToken = this.userService.generateSession(user);

    window.sessionStorage.setItem("USER_SESSION_TOKEN", sessionToken);
    SavesService.save(this.userService);

    window.location.replace("/articles");
  }

}
