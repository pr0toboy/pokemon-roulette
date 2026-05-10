import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { GameStateService } from '../../../../services/game-state-service/game-state.service';
import { GenerationService } from '../../../../services/generation-service/generation.service';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';
import { GymLeader } from '../../../../interfaces/gym-leader';
import { BaseBattleRouletteComponent } from '../base-battle-roulette/base-battle-roulette.component';
import { villainByGeneration } from './villain-by-generation';

/**
 * Battle Tower floor-5 milestone fight against the generation's marquee
 * villain (Giovanni, Cyrus, Lysandre, …). The wheel is collapsed to two
 * weighted slices for readability (same convention as the regular tower
 * wheel) and is tuned around a ~30 % baseline win-rate that scales with the
 * player's team power and level training. Defeat ends the run; victory hands
 * out the Master Ball.
 */
@Component({
  selector: 'app-villain-battle-roulette',
  imports: [CommonModule, WheelComponent, TranslatePipe],
  templateUrl: './villain-battle-roulette.component.html',
  styleUrl: './villain-battle-roulette.component.css'
})
export class VillainBattleRouletteComponent extends BaseBattleRouletteComponent {

  villainByGeneration = villainByGeneration;

  @ViewChild('villainPresentationModal', { static: true }) villainPresentationModal!: TemplateRef<any>;
  @ViewChild('itemUsedModal', { static: true }) itemUsedModal!: TemplateRef<any>;

  @Output() battleResultEvent = new EventEmitter<boolean>();

  currentVillain!: GymLeader;

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
    if (this.victoryOdds[index].text === 'game.main.roulette.villain.yes') {
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
    if (state === 'villain-battle') {
      this.currentVillain = this.villainByGeneration[this.generation.id];
      this.calcVictoryOdds();
      this.modalService.open(this.villainPresentationModal, { centered: true, size: 'lg' });
    }
  }

  protected override calcVictoryOdds(): void {
    let yesWeight = 1;
    this.trainerTeam?.forEach(pokemon => { yesWeight += pokemon.power; });
    yesWeight += this.plusModifiers();
    yesWeight += this.calcLevelBonus();

    // Tuned for ~30% win at the typical floor-5 entry stats (team avg lvl
    // ~17, power 18 → ~21 yes). 50 baseline no keeps the fight tense but
    // beatable; team levels naturally push the win rate up as the player
    // grinds the tower.
    const noWeight = 50;

    this.victoryOdds = [
      { text: 'game.main.roulette.villain.yes', fillStyle: 'green',   weight: yesWeight },
      { text: 'game.main.roulette.villain.no',  fillStyle: 'crimson', weight: noWeight },
    ];
  }
}
