import { Injectable } from '@angular/core';
import { itemsData } from './items-data';
import { ItemName } from './item-names';
import { ItemItem } from '../../interfaces/item-item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor() { }

  itemsData = itemsData;

  getItem(itemName: ItemName): ItemItem {
    return this.itemsData[itemName];
  }

  getAllItems(): ItemItem[] {
    return Object.values(this.itemsData);
  }

  // Items eligible for the generic "find item" wheel. Items with weight 0 are
  // reserved for dedicated rewards (e.g. mega-stone is cave-only).
  getDiscoverableItems(): ItemItem[] {
    return Object.values(this.itemsData).filter(item => item.weight > 0);
  }
}
