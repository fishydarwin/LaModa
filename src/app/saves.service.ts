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

  static jsonifyMap(map: Map<any, any>): string {
    const obj: { [key: string]: string } = {};
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return JSON.stringify(obj);
  }

}
