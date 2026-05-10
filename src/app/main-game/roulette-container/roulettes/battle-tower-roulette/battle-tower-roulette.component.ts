import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { WheelItem } from '../../../../interfaces/wheel-item';
import { GameStateService } from '../../../../services/game-state-service/game-state.service';
import { GenerationService } from '../../../../services/generation-service/generation.service';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';
import { interleaveOdds } from '../../../../utils/odd-utils';
import { BaseBattleRouletteComponent } from '../base-battle-roulette/base-battle-roulette.component';

/**
 * Battle Tower — postgame mini-game directly inspired by the Battle Tower /
 * Battle Frontier from Pokémon. The player climbs floors one fight at a time:
 * - Each fight is a yes/no roulette like a gym battle.
 * - "yes" slices come from the team's total power + level training bonus.
 * - "no" slices grow with the current floor, so deeper floors are harder.
 * - On a loss, a potion (if held) grants a retry — same mechanic as the gym,
 *   E4, Champion and Boss wheels.
 * The component itself is stateless about progression: the parent owns the
 * `currentFloor` counter and increments it on victory.
 */
@Component({
  selector: 'app-battle-tower-roulette',
  imports: [CommonModule, WheelComponent, TranslatePipe],
  templateUrl: './battle-tower-roulette.component.html',
  styleUrl: './battle-tower-roulette.component.css'
})
export class BattleTowerRouletteComponent extends BaseBattleRouletteComponent {

  @ViewChild('itemUsedModal', { static: true }) itemUsedModal!: TemplateRef<any>;

  @Input() currentFloor = 1;
  @Output() battleResultEvent = new EventEmitter<boolean>();

  constructor(
    modalService: NgbModal,
    gameStateService: GameStateService,
    generationService: GenerationService,
    trainerService: TrainerService,
    translate: TranslateService
  ) {
    super(modalService, gameStateService, generationService, trainerService, translate);
  }

  onItemSelected(index: number): void {
    this.retries--;
    if (this.victoryOdds[index].text === 'game.main.roulette.tower.yes') {
      this.battleResultEvent.emit(true);
    } else if (this.retries <= 0) {
      const potion = this.hasPotions();
      if (potion) {
        this.usePotion(potion, () => this.modalService.open(this.itemUsedModal, { centered: true, size: 'md' }));
      } else {
        this.battleResultEvent.emit(false);
      }
    }
  }

  protected override onGameStateChange(state: string): void {
    if (state === 'battle-tower') {
      this.calcVictoryOdds();
    }
  }

  protected override calcVictoryOdds(): void {
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

    const powerModifier = this.plusModifiers();
    for (let i = 0; i < powerModifier; i++) {
      yesOdds.push({ text: 'game.main.roulette.tower.yes', fillStyle: 'gold', weight: 1 });
    }

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
}
