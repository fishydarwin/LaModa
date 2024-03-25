import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { User, UserValidator } from '../user';
import { StatusService } from '../status.service';
import { SavesService } from '../saves.service';
import { NgIf } from '@angular/common';
import { NoAccessComponent } from '../no-access/no-access.component';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [FormsModule, NgIf, NoAccessComponent],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent {
  
  valid: boolean = true;

  name: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(private userService: UserService) {
    let user = this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'));
    if (user != undefined) {
      this.valid = false;
    }
  }

  register(): void {

    if (this.userService.anyByEmail(this.email)) {
      StatusService.showStatus("Există deja un utilizator cu această adresă de e-mail.");
      return;
    }

    let dummy_user: User = {
      id: -1, name: this.name, email: this.email, password_obfuscated: this.password, role: "user"
    };

    let validation = UserValidator.validate(dummy_user);
    if (validation != "OK") {
      StatusService.showStatus(validation);
      return;
    }

    if (this.password != this.confirmPassword) {
      StatusService.showStatus("Parolele trebuie să coincidă.");
      return;
    }

    let userId = this.userService.add(dummy_user);
    let user = this.userService.byId(userId);
    
    let sessionToken = this.userService.generateSession(user);
    window.sessionStorage.setItem("USER_SESSION_TOKEN", sessionToken);

    SavesService.save(this.userService);
    window.location.replace("/articles");

  }

}
