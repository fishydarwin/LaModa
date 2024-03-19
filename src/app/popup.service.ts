import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private static message: string = "";
  static acceptCallback: any = () => { console.log("Unimplemented popup accept callback!"); };
  static cancelCallback: any = () => { console.log("Unimplemented popup cancel callback!"); };

  constructor() { }

  private static disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll= () => { window.scrollTo(x, y); };
  }

  private static enableScrolling() {
    window.onscroll= () => {};
  }

  static setMessage(message: string) {
    this.message = message;
    if (message.length > 0) {
      this.disableScrolling();
    } else {
      this.enableScrolling();
    }
  }

  static getMessage(): string {
    return this.message;
  }

  static empty(): boolean {
    return this.message.length <= 0;
  }
  
}
