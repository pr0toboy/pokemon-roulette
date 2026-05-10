import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { ItemsService } from '../../../../services/items-service/items.service';
import { ItemItem } from '../../../../interfaces/item-item';

/**
 * Shop — "get" wheel. Spins the entire item catalogue (mega-stone included)
 * with uniform weights so every item is an equally fair trade outcome.
 */
@Component({
  selector: 'app-shop-get-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './shop-get-roulette.component.html',
  styleUrl: './shop-get-roulette.component.css'
})
export class ShopGetRouletteComponent implements OnInit {

  items: ItemItem[] = [];
  @Output() selectedItemEvent = new EventEmitter<ItemItem>();

  constructor(private itemsService: ItemsService) {}

  ngOnInit(): void {
    // Force uniform weights so rare items (mega-stone, hyperball) get the
    // same chance as commons — the shop is meant to be a fair trade.
    this.items = this.itemsService.getAllItems().map(item => ({ ...item, weight: 1 }));
  }

  onItemSelected(index: number): void {
    this.selectedItemEvent.emit(this.items[index]);
  }
}
