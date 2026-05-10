import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';

@Component({
  selector: 'app-catch-boss-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './catch-boss-roulette.component.html',
  styleUrl: './catch-boss-roulette.component.css'
})
export class CatchBossRouletteComponent implements OnInit {

  constructor(private trainerService: TrainerService) {}

  // LUCKY_MODE: keep `yes` as the rarest slice so the wheel's "always pick the
  // rarest" rule lands on a successful catch.
  catchRate = [
    { text: 'game.main.roulette.boss.catch.yes', fillStyle: 'green', weight: 1 },
    { text: 'game.main.roulette.boss.catch.no', fillStyle: 'crimson', weight: 3 }
  ];

  private hyperballUsed = false;
  private masterBallUsed = false;

  @Output() catchBossEvent = new EventEmitter<void>();
  @Output() nothingHappensEvent = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.trainerService.hasItem('master-ball')) {
      this.catchRate = [
        { text: 'game.main.roulette.boss.catch.yes', fillStyle: 'darkviolet', weight: 1 },
        { text: 'game.main.roulette.boss.catch.no',  fillStyle: 'crimson',    weight: 0 }
      ];
      this.masterBallUsed = true;
      return;
    }
    if (this.trainerService.hasItem('hyperball')) {
      this.catchRate = [
        { text: 'game.main.roulette.boss.catch.yes', fillStyle: 'green', weight: 2 },
        { text: 'game.main.roulette.boss.catch.no', fillStyle: 'crimson', weight: 1 }
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
    if (this.catchRate[index].text === 'game.main.roulette.boss.catch.yes') {
      this.catchBossEvent.emit();
    } else {
      this.nothingHappensEvent.emit();
    }
  }
}
