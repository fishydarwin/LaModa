import { Injectable } from '@angular/core';
import { USERS } from './mock-data';
import { User } from './user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  NULL_USER: User = { id: -1, name: '', password_obfuscated: '', email: '', role: '' };

  constructor() { }

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
