import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import {TranslatePipe} from '@ngx-translate/core';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';

@Component({
  selector: 'app-catch-legendary-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './catch-legendary-roulette.component.html',
  styleUrl: './catch-legendary-roulette.component.css'
})
export class CatchLegendaryRouletteComponent implements OnInit {

  constructor(private trainerService: TrainerService) {}

  // LUCKY_MODE: keep `yes` as the rarest slice for every round so the wheel's
  // "always pick the rarest" rule lands on a successful catch every time.
  catchRate = [
    { text: 'game.main.roulette.legendary.yes', fillStyle: 'green', weight: 1 },
    { text: 'game.main.roulette.legendary.no', fillStyle: 'crimson', weight: 3 }
  ];

  private hyperballUsed = false;

  ngOnInit(): void {
    // Hyper Ball: when held, boosts catch odds for this attempt and is consumed on spin.
    if (this.trainerService.hasItem('hyperball')) {
      this.catchRate = [
        { text: 'game.main.roulette.legendary.yes', fillStyle: 'green', weight: 2 },
        { text: 'game.main.roulette.legendary.no', fillStyle: 'crimson', weight: 1 }
      ];
      this.hyperballUsed = true;
    }
  }

  @Input() currentRound: number = 0;
  @Output() catchLegendaryEvent = new EventEmitter<void>();
  @Output() nothingHappensEvent = new EventEmitter<void>();

  onItemSelected(index: number): void {
    if (this.hyperballUsed) {
      const hyperball = this.trainerService.getItem('hyperball');
      if (hyperball) {
        this.trainerService.removeItem(hyperball);
      }
      this.hyperballUsed = false;
    }
    if (this.catchRate[index].text === 'game.main.roulette.legendary.yes') {
      this.catchLegendaryEvent.emit();
    } else {
      this.nothingHappensEvent.emit();
    };
  }
}
