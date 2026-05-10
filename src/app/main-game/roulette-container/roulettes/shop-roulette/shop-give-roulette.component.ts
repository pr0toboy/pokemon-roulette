import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';
import { ItemItem } from '../../../../interfaces/item-item';

/**
 * Shop — "give" wheel. Player spins their own bag to decide which item is
 * sacrificed in the trade. The matching `shop-get` wheel then rolls the
 * replacement from the full item catalogue.
 */
@Component({
  selector: 'app-shop-give-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './shop-give-roulette.component.html',
  styleUrl: './shop-give-roulette.component.css'
})
export class ShopGiveRouletteComponent implements OnInit, OnDestroy {

  items: ItemItem[] = [];
  /** Title key — defaults to the shop "trade away" prompt but the discard
   *  flow reuses this component with the "throw away" prompt instead. */
  @Input() titleKey: string = 'game.main.roulette.shop.give';
  @Output() selectedItemEvent = new EventEmitter<ItemItem>();

  private subscription: Subscription | null = null;

  constructor(private trainerService: TrainerService) {}

  ngOnInit(): void {
    this.subscription = this.trainerService.getItemsObservable().subscribe(items => {
      this.items = items;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onItemSelected(index: number): void {
    this.selectedItemEvent.emit(this.items[index]);
  }
}
