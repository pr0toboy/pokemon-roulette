import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WheelComponent } from '../../../../wheel/wheel.component';

@Component({
  selector: 'app-catch-mythical-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './catch-mythical-roulette.component.html',
  styleUrl: './catch-mythical-roulette.component.css'
})
export class CatchMythicalRouletteComponent {

  // Mythicals are deliberately rarer than legendaries: 1 yes : 5 no.
  // The wheel's LUCKY_MODE always lands on the rarest slice ("yes"), so
  // the *visible* odds are what matter most for the player's perception.
  catchRate = [
    { text: 'game.main.roulette.mythical.yes', fillStyle: 'gold', weight: 1 },
    { text: 'game.main.roulette.mythical.no', fillStyle: 'crimson', weight: 5 }
  ];

  @Output() catchMythicalEvent = new EventEmitter<void>();
  @Output() nothingHappensEvent = new EventEmitter<void>();

  onItemSelected(index: number): void {
    if (this.catchRate[index].text === 'game.main.roulette.mythical.yes') {
      this.catchMythicalEvent.emit();
    } else {
      this.nothingHappensEvent.emit();
    }
  }
}
