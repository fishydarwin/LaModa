import { Injectable } from '@angular/core';
import { USERS } from './mock-data';
import { User } from './user';
import { Observable, of } from 'rxjs';
import { Savable } from './savable';
import { SavesService } from './saves.service';
import { v4 as uuid } from 'uuid';

export let USER_SESSIONS: Map<string, User> = new Map(); //TODO: move to backend, security issue!

@Injectable({
  providedIn: 'root'
})
export class UserService implements Savable {

  NULL_USER: User = { id: -1, name: '', password_obfuscated: '', email: '', role: '' };

  saveData(): void {
    window.sessionStorage.setItem('USERS', JSON.stringify(USERS));
    console.log(USER_SESSIONS.size);
    window.sessionStorage.setItem('USER_SESSIONS', SavesService.jsonifyMap(USER_SESSIONS));
  }

  loadData(): void {
    let saveState: string | null = window.sessionStorage.getItem('USERS');
    if (saveState != null) {
      let result: User[] = JSON.parse(saveState);
      USERS.splice(0, USERS.length);
      result.forEach(user => USERS.push(user))
    }

    let userSessions: string | null = window.sessionStorage.getItem('USER_SESSIONS');
    if (userSessions != null) {
      let result: Map<string, User> = new Map(Object.entries(JSON.parse(userSessions)));
      USER_SESSIONS.clear();
      result.forEach((value: User, key: string) => {
        USER_SESSIONS.set(key, value);
      });
    }
  }

  constructor() { 
    SavesService.load(this);
    this.last_available_id = USERS.length + 1;
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

  /* LOGIN RELATED */

  idByDetails(email: string, password_obfuscated: string): number {
    for (let i = 0; i < USERS.length; i++)
      if (USERS[i].email == email && USERS[i].password_obfuscated == password_obfuscated)
        return USERS[i].id;
    return -1;
  }

  generateSession(who: User): string { // TODO: should be on backend! security issue!
    let randomUUID = uuid();
    USER_SESSIONS.set(randomUUID, who);
    console.log(USER_SESSIONS.size)
    return randomUUID;
  }

  fromSession(id: string | null): User | undefined {
    if (id == null)
      return;
    if (USER_SESSIONS.has(id))
      return USER_SESSIONS.get(id);
    return;
  }

  /* REGISTER RELATED */
  last_available_id = 0;

  add(user: User): number {
    user.id = this.last_available_id;
    this.last_available_id++;
    USERS.push(user);
    return user.id;
  }

  anyByEmail(email: string): boolean {
    for (let i = 0; i < USERS.length; i++)
      if (USERS[i].email == email)
        return true;
    return false;
  }

}
