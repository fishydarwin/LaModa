import { Injectable } from '@angular/core';
import { USERS } from './mock-data';
import { User } from './user';
import { Observable, of } from 'rxjs';
import { Savable } from './savable';
import { SavesService } from './saves.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements Savable {

  NULL_USER: User = { id: -1, name: '', password_obfuscated: '', email: '', role: '' };

  saveData(): void {
    window.sessionStorage.setItem('USERS', JSON.stringify(USERS));
  }

  loadData(): void {
    let saveState: string | null = window.sessionStorage.getItem('USERS');
    if (saveState != null) {
      let result: User[] = JSON.parse(saveState);
      USERS.splice(0, USERS.length);
      result.forEach(article => USERS.push(article))
    }
  }

  constructor() { 
    SavesService.load(this);
  }

  all(): Observable<User[]> {
    const users = of(USERS);
    return users;
  }

  any(id: number): boolean {
    for (let i = 0; i < USERS.length; i++)
      if (USERS[i].id == id)
        return true;
    return false;
  }

  byId(id: number): User {
    for (let i = 0; i < USERS.length; i++)
      if (USERS[i].id == id)
        return USERS[i];
    return this.NULL_USER;
  }

}
