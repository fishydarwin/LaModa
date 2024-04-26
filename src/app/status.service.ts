import { Injectable } from '@angular/core';
import { Savable } from './savable';
import { SavesService } from './saves.service';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private static currentStatus: string = "";

  private static saveData(): void {
    window.sessionStorage.setItem('STATUS', StatusService.currentStatus);
  }

  private static loadData(): void {
    let saveState: string | null = window.sessionStorage.getItem('STATUS');
    if (saveState != null) {
      StatusService.crossPageStatus(saveState);
    }
  }

  static get(): string {
    this.loadData();
    return this.currentStatus;
  }

  static has(): boolean {
    this.loadData();
    return this.currentStatus.length > 0;
  }

  private static currentTimeout: any;
  static showStatus(message: string) {
    
    this.currentStatus = message;
    window.sessionStorage.removeItem('STATUS');

    if (this.currentTimeout != null)
      clearTimeout(this.currentTimeout);

    this.currentTimeout = setTimeout(() => { 
      this.currentStatus = "";
      clearTimeout(this.currentTimeout);
    }, 7000);
  }

  static crossPageStatus(message: string) {
    this.currentStatus = message;
    StatusService.saveData();

    setTimeout(() => { 
      this.currentStatus = "";
      StatusService.saveData();
    }, 7000);
  }
  
}
