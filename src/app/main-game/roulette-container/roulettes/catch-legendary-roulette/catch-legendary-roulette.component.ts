import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-catch-legendary-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './catch-legendary-roulette.component.html',
  styleUrl: './catch-legendary-roulette.component.css'
})
export class CatchLegendaryRouletteComponent implements OnInit {

  // LUCKY_MODE: keep `yes` as the rarest slice for every round so the wheel's
  // "always pick the rarest" rule lands on a successful catch every time.
  catchRate = [
    { text: 'game.main.roulette.legendary.yes', fillStyle: 'green', weight: 1 },
    { text: 'game.main.roulette.legendary.no', fillStyle: 'crimson', weight: 3 }
  ];

  ngOnInit(): void {
    // weights intentionally fixed — see LUCKY_MODE in WheelComponent.
  }

  @Input() currentRound: number = 0;
  @Output() catchLegendaryEvent = new EventEmitter<void>();
  @Output() nothingHappensEvent = new EventEmitter<void>();

  onItemSelected(index: number): void {
    if (this.catchRate[index].text === 'game.main.roulette.legendary.yes') {
      this.catchLegendaryEvent.emit();
    } else {
      this.nothingHappensEvent.emit();
    };
  }
}
