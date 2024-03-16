import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ArticlesComponent } from './articles/articles.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { StatusService } from './status.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ArticlesComponent, FormsModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'laModă';

  constructor(private statusService: StatusService) {
  }

  hasStatus(): boolean {
    return this.statusService.has();
  }

  getStatus(): string {
    return this.statusService.get();
  }
}
