import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { WheelItem } from '../../../../interfaces/wheel-item';
import { PokemonItem } from '../../../../interfaces/pokemon-item';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';
import { interleaveOdds } from '../../../../utils/odd-utils';

/**
 * Battle Tower — postgame mini-game directly inspired by the Battle Tower /
 * Battle Frontier from Pokémon. The player climbs floors one fight at a time:
 * - Each fight is a yes/no roulette like a gym battle.
 * - "yes" slices come from the team's total power + level training bonus.
 * - "no" slices grow with the current floor, so deeper floors are harder.
 * The component itself is stateless about progression: the parent owns the
 * `currentFloor` counter and increments it on victory.
 */
@Component({
  selector: 'app-battle-tower-roulette',
  imports: [CommonModule, WheelComponent, TranslatePipe],
  templateUrl: './battle-tower-roulette.component.html',
  styleUrl: './battle-tower-roulette.component.css'
})
export class BattleTowerRouletteComponent implements OnInit, OnDestroy {

  @Input() currentFloor = 1;
  @Output() battleResultEvent = new EventEmitter<boolean>();

  victoryOdds: WheelItem[] = [];

  private trainerTeam: PokemonItem[] = [];
  private teamSubscription: Subscription | null = null;

  constructor(private trainerService: TrainerService) {}

  ngOnInit(): void {
    this.teamSubscription = this.trainerService.getTeamObservable().subscribe(team => {
      this.trainerTeam = team;
      this.calcVictoryOdds();
    });
  }

  ngOnDestroy(): void {
    this.teamSubscription?.unsubscribe();
  }

  onItemSelected(index: number): void {
    const won = this.victoryOdds[index].text === 'game.main.roulette.tower.yes';
    this.battleResultEvent.emit(won);
  }

  private calcVictoryOdds(): void {
    const yesOdds: WheelItem[] = [];
    const noOdds: WheelItem[] = [];

    // Always at least one win slice so the run is never literally impossible
    // even with a brand-new postgame team.
    yesOdds.push({ text: 'game.main.roulette.tower.yes', fillStyle: 'gold', weight: 1 });

    this.trainerTeam.forEach(pokemon => {
      for (let i = 0; i < pokemon.power; i++) {
        yesOdds.push({ text: 'game.main.roulette.tower.yes', fillStyle: 'gold', weight: 1 });
      }
    });

    // Same level-bonus model as the gym wheel so training stays meaningful.
    const levelBonus = this.calcLevelBonus();
    for (let i = 0; i < levelBonus; i++) {
      yesOdds.push({ text: 'game.main.roulette.tower.yes', fillStyle: 'gold', weight: 1 });
    }

    // Floor difficulty: starts at 2 no-slices, +1 per floor cleared.
    const noSlices = 1 + this.currentFloor;
    for (let i = 0; i < noSlices; i++) {
      noOdds.push({ text: 'game.main.roulette.tower.no', fillStyle: 'crimson', weight: 1 });
    }

    this.victoryOdds = interleaveOdds(yesOdds, noOdds);
  }

  private calcLevelBonus(): number {
    if (!this.trainerTeam.length) return 0;
    const startingLevel = TrainerService.STARTING_LEVEL;
    const totalLevels = this.trainerTeam.reduce(
      (sum, p) => sum + (p.level ?? startingLevel),
      0
    );
    const avgLevel = totalLevels / this.trainerTeam.length;
    return Math.max(0, Math.floor((avgLevel - startingLevel) / 5));
  }
}
