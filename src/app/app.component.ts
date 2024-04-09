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
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, first, interval, repeat, retry, throwError, timeout } from 'rxjs';

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

  connected: boolean = false;
  internet: boolean = true;

  constructor(private userService: UserService, private http: HttpClient) {
    this.userService.fromSession(window.sessionStorage.getItem('USER_SESSION_TOKEN'))
      .subscribe((user) => this.user = user);
    
    this.checkConnection();
    this.checkInternet();
  }

  private checkConnection() {
    this.connectionChecker
      .pipe(repeat({ delay: 3000 }))
      .subscribe((result) => {
        if (!this.connected)
          StatusService.showStatus("");
        this.connected = true;
      });
  }

  private connectionChecker: Observable<string> =
    this.http.get<string>("http://localhost:8080/status",
        { headers: new HttpHeaders({ timeout: `${6000}` }) }
    )
      .pipe(
        catchError((error: HttpErrorResponse, caught) => {
          if (!StatusService.has())
            StatusService.showStatus("Eroare la serverul back-end: " 
              + error.status + " (" + error.statusText + ")");
          this.connected = false;
          return throwError(() => new Error('No connection to the back-end. Please try again later.'))
        }),
        retry()
      );

  private checkInternet() {
    setInterval(() => {
      fetch('https://google.com', {
          mode: 'no-cors',
      })
      .then(() => {
        if (!this.internet)
          StatusService.showStatus("");
        this.internet = true;
      })
      .catch(() => {
        if (!StatusService.has())
          StatusService.showStatus("Nu ai conexiune la internet. Te rugăm să încerci mai târziu.");
        this.internet = false;
      })
    }, 2000);
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
