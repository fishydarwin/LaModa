import { Component, Input } from '@angular/core';
import { PopupService } from '../popup.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [NgIf],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {

  constructor(private popupService: PopupService) {
  }

  display(): boolean {
    return !PopupService.empty();
  }

  getMessage(): string {
    return PopupService.getMessage();
  }

  callAccept(): void {
    PopupService.acceptCallback();
  }

  callCancel(): void {
    PopupService.cancelCallback();
    PopupService.setMessage("");
  }

}
