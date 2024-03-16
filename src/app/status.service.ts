import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  currentStatus: string = "";

  constructor() {
  }

  get(): string {
    return this.currentStatus;
  }

  has() {
    return this.currentStatus.length > 0;
  }

  showStatus(message: string) {
    this.currentStatus = message;
    setTimeout(() => { this.currentStatus = ""; }, 7000);
  }
}
