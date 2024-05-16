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
  
  valid: boolean = false;

  name: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(private userService: UserService) {
    this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
      .subscribe(user => {
        if (user == undefined) {
          this.valid = true;
        }
      });
  }

  register(): void {

    this.userService.anyByEmail(this.email)
      .subscribe(ifEmail => {

        if (ifEmail) {
          StatusService.showStatus("Există deja un utilizator cu această adresă de e-mail.");
          return;
        }

        let dummy_user: User = {
          id: -1, name: this.name, email: this.email, passwordObfuscated: this.password, role: "user"
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
    
        this.userService.add(dummy_user)
          .subscribe((userId) => {
            this.userService.byId(userId)
              .subscribe((user) => {
                user.passwordObfuscated = this.password;
                this.userService.generateSession(user)
                  .subscribe((sessionToken) => {
                    window.sessionStorage.setItem("USER_SESSION_TOKEN", sessionToken);
                    window.location.replace("/articles");
                  });
                
              });
          });

      })
  }

}
