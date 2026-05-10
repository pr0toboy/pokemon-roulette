import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';

@Component({
  selector: 'app-catch-paradox-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './catch-paradox-roulette.component.html',
  styleUrl: './catch-paradox-roulette.component.css'
})
export class CatchParadoxRouletteComponent implements OnInit {

  constructor(private trainerService: TrainerService) {}

  catchRate = [
    { text: 'game.main.roulette.legendary.yes', fillStyle: 'green',   weight: 1 },
    { text: 'game.main.roulette.legendary.no',  fillStyle: 'crimson', weight: 2 }
  ];

  private hyperballUsed = false;
  private masterBallUsed = false;

  @Input() currentRound: number = 0;
  @Input() titleKey: string = 'game.main.roulette.areaZero.catch';
  @Output() catchParadoxEvent = new EventEmitter<void>();
  @Output() nothingHappensEvent = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.trainerService.hasItem('master-ball')) {
      this.catchRate = [
        { text: 'game.main.roulette.legendary.yes', fillStyle: 'darkviolet', weight: 1 },
        { text: 'game.main.roulette.legendary.no',  fillStyle: 'crimson',    weight: 0 }
      ];
      this.masterBallUsed = true;
      return;
    }
    // Late-game ramp: at round 4+ the paradox catch already tilts toward yes.
    if (this.currentRound >= 4) {
      this.catchRate = [
        { text: 'game.main.roulette.legendary.yes', fillStyle: 'green',   weight: 2 },
        { text: 'game.main.roulette.legendary.no',  fillStyle: 'crimson', weight: 1 },
      ];
    }
    // Hyper Ball: single-use catch booster — overrides the round-based odds
    // when present and is consumed on spin regardless of outcome.
    if (this.trainerService.hasItem('hyperball')) {
      this.catchRate = [
        { text: 'game.main.roulette.legendary.yes', fillStyle: 'green',   weight: 2 },
        { text: 'game.main.roulette.legendary.no',  fillStyle: 'crimson', weight: 1 }
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
    if (this.catchRate[index].text === 'game.main.roulette.legendary.yes') {
      this.catchParadoxEvent.emit();
    } else {
      this.nothingHappensEvent.emit();
    }
  }
}
