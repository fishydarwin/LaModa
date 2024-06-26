import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, first, firstValueFrom} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { requestUrl } from './app.config';

// export let USER_SESSIONS: Map<string, User> = new Map();

@Injectable({
  providedIn: 'root'
})
export class UserService {

  NULL_USER: User = { id: -1, name: '', passwordObfuscated: '', email: '', role: '' };

  // saveData(): void {
  //   window.sessionStorage.setItem('USERS', JSON.stringify(USERS));
  //   console.log(USER_SESSIONS.size);
  //   window.sessionStorage.setItem('USER_SESSIONS', SavesService.jsonifyMap(USER_SESSIONS));
  // }

  // loadData(): void {
  //   let saveState: string | null = window.sessionStorage.getItem('USERS');
  //   if (saveState != null) {
  //     let result: User[] = JSON.parse(saveState);
  //     USERS.splice(0, USERS.length);
  //     result.forEach(user => USERS.push(user))
  //   }

  //   let userSessions: string | null = window.sessionStorage.getItem('USER_SESSIONS');
  //   if (userSessions != null) {
  //     let result: Map<string, User> = new Map(Object.entries(JSON.parse(userSessions)));
  //     USER_SESSIONS.clear();
  //     result.forEach((value: User, key: string) => {
  //       USER_SESSIONS.set(key, value);
  //     });
  //   }
  // }

  constructor(private http: HttpClient) { 
    // SavesService.load(this);
    // this.last_available_id = USERS.length + 1;
  }

  all(): Observable<User[]> {
    return this.http.get<User[]>(requestUrl + "/user/all");
  }

  any(id: number): Observable<boolean> {
    return this.http.get<boolean>(
       requestUrl + "/user/any", {
      params: new HttpParams()
      .set('id', id)
    });
  }

  byId(id: number): Observable<User> {
    return this.http.get<User>( requestUrl + "/user/byId", {
      params: new HttpParams()
      .set('id', id)
    });
  }

  /* LOGIN RELATED */

  idByDetails(email: string, password_obfuscated: string): Observable<number> {
    return this.http.get<number>( requestUrl + "/user/idByDetails", {
      params: new HttpParams()
      .set('email', email)
      .set('passwordObfuscated', password_obfuscated)
    });
  }

  generateSession(who: User): Observable<string> {
    return this.http.get<string>( requestUrl + "/user/generateSession", {
      params: new HttpParams()
        .set('id', who.id)
        .set('email', who.email)
        .set('passwordObfuscated', who.passwordObfuscated),
    });
  }

  fromSession(id: string | null): Observable<User | undefined> {
    return this.http.get<User | undefined>( requestUrl + "/user/bySession", {
      params: new HttpParams()
        .set('sessionId', id == null ? -1 : id)
    });
  }

  /* REGISTER RELATED */
  // last_available_id = 0;

  add(user: User): Observable<number> {
    user.role = user.role.toUpperCase();
    return this.http.post<number>( requestUrl + "/user/add", user);
  }

  anyByEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>( requestUrl + "/user/anyByEmail", {
      params: new HttpParams()
      .set('email', email)
    });
  }

  changeModerator(email: string): Observable<boolean> {
    let sessionId = window.sessionStorage.getItem('USER_SESSION_TOKEN');
    return this.http.put<boolean>( requestUrl + "/user/changeModerator/" + email + 
                                 "?sessionId=" + sessionId, []);
  }

}
