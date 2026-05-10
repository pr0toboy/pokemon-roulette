import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { GameStateService } from '../../../../services/game-state-service/game-state.service';
import { GenerationService } from '../../../../services/generation-service/generation.service';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';
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
    // Tower fights mid-postgame can pile up 150+ unit slices when written
    // with the gym-wheel pattern (`push(weight: 1)` N times). That makes the
    // wheel a blur of micro-segments. We keep the exact same odds maths but
    // collapse each side into a single weighted slice — the win/loss split
    // stays mathematically identical, just rendered as two big arcs the
    // player can actually read.
    let yesWeight = 1;
    this.trainerTeam.forEach(pokemon => { yesWeight += pokemon.power; });
    yesWeight += this.plusModifiers();
    yesWeight += this.calcLevelBonus();

    // Floor difficulty: 4 baseline no-weight + 5 per floor reached. The level
    // cap (100) caps the yes side around 38 even with a full power-5 team, so
    // the no-weight has to climb steeply to keep the deeper floors meaningful
    // — by floor 20 the wheel is squarely on the unfavourable side and the
    // player must lean on potions / x-attacks to break through.
    const noWeight = 4 + 5 * this.currentFloor;

    this.victoryOdds = [
      { text: 'game.main.roulette.tower.yes', fillStyle: 'gold',    weight: yesWeight },
      { text: 'game.main.roulette.tower.no',  fillStyle: 'crimson', weight: noWeight },
    ];
  }
}
