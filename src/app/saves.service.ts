import { Injectable } from '@angular/core';
import { Savable } from './savable';

@Injectable({
  providedIn: 'root'
})
export class SavesService {
  constructor() { }

  static save(entity: Savable) {
    entity.saveData();
  }

  static load(entity: Savable) {
    entity.loadData();
  }
}
