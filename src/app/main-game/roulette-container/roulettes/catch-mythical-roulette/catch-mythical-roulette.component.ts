import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';

@Component({
  selector: 'app-catch-mythical-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './catch-mythical-roulette.component.html',
  styleUrl: './catch-mythical-roulette.component.css'
})
export class CatchMythicalRouletteComponent implements OnInit {

  constructor(private trainerService: TrainerService) {}

  // Mythicals are deliberately rarer than legendaries: 1 yes : 5 no.
  catchRate = [
    { text: 'game.main.roulette.mythical.yes', fillStyle: 'gold',    weight: 1 },
    { text: 'game.main.roulette.mythical.no',  fillStyle: 'crimson', weight: 5 }
  ];

  private hyperballUsed = false;
  private masterBallUsed = false;

  @Output() catchMythicalEvent = new EventEmitter<void>();
  @Output() nothingHappensEvent = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.trainerService.hasItem('master-ball')) {
      this.catchRate = [
        { text: 'game.main.roulette.mythical.yes', fillStyle: 'darkviolet', weight: 1 },
        { text: 'game.main.roulette.mythical.no',  fillStyle: 'crimson',    weight: 0 }
      ];
      this.masterBallUsed = true;
      return;
    }
    // Hyper Ball: single-use catch booster. Tilts the odds for this attempt
    // and is consumed on spin regardless of outcome.
    if (this.trainerService.hasItem('hyperball')) {
      this.catchRate = [
        { text: 'game.main.roulette.mythical.yes', fillStyle: 'gold',    weight: 2 },
        { text: 'game.main.roulette.mythical.no',  fillStyle: 'crimson', weight: 1 }
      ];
      this.hyperballUsed = true;
    }
  }

  onItemSelected(index: number): void {
    if (this.masterBallUsed) {
      const masterBall = this.trainerService.getItem('master-ball');
      if (masterBall) {
        this.trainerService.removeItem(masterBall);
      }
      this.masterBallUsed = false;
    }
    if (this.hyperballUsed) {
      const hyperball = this.trainerService.getItem('hyperball');
      if (hyperball) {
        this.trainerService.removeItem(hyperball);
      }
      this.hyperballUsed = false;
    }
    if (this.catchRate[index].text === 'game.main.roulette.mythical.yes') {
      this.catchMythicalEvent.emit();
    } else {
      this.nothingHappensEvent.emit();
    }
  }
}
