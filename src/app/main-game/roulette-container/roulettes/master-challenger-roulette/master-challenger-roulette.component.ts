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
 * Master Challenger — postgame win-or-lose duel triggered by the "Challenger"
 * slice on the master roulette. Defeat ends the run (game-over), so the wheel
 * scales like a Champion-tier fight: heavy baseline "no" slices that grow with
 * the player's progress, balanced by team power + level training.
 */
@Component({
  selector: 'app-master-challenger-roulette',
  imports: [CommonModule, WheelComponent, TranslatePipe],
  templateUrl: './master-challenger-roulette.component.html',
  styleUrl: './master-challenger-roulette.component.css'
})
export class MasterChallengerRouletteComponent extends BaseBattleRouletteComponent {

  @ViewChild('challengerPresentationModal', { static: true }) challengerPresentationModal!: TemplateRef<any>;

  @Input() currentRound: number = 0;
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
    const won = this.victoryOdds[index].text === 'game.main.roulette.challenger.yes';
    this.battleResultEvent.emit(won);
  }

  protected override onGameStateChange(state: string): void {
    if (state === 'master-challenger') {
      this.calcVictoryOdds();
      this.modalService.open(this.challengerPresentationModal, { centered: true, size: 'lg' });
    }
  }

  protected override calcVictoryOdds(): void {
    const yesOdds: WheelItem[] = [];
    const noOdds: WheelItem[] = [];

    yesOdds.push({ text: 'game.main.roulette.challenger.yes', fillStyle: 'green', weight: 1 });

    this.trainerTeam.forEach(pokemon => {
      for (let i = 0; i < pokemon.power; i++) {
        yesOdds.push({ text: 'game.main.roulette.challenger.yes', fillStyle: 'green', weight: 1 });
      }
    });

    const powerModifier = this.plusModifiers();
    for (let i = 0; i < powerModifier; i++) {
      yesOdds.push({ text: 'game.main.roulette.challenger.yes', fillStyle: 'green', weight: 1 });
    }

    const levelBonus = this.calcLevelBonus();
    for (let i = 0; i < levelBonus; i++) {
      yesOdds.push({ text: 'game.main.roulette.challenger.yes', fillStyle: 'green', weight: 1 });
    }

    // Champion-tier baseline: 3 fixed no-slices + 1 per round completed.
    // Losing ends the run, so the wheel needs real teeth.
    for (let i = 0; i < this.currentRound; i++) {
      noOdds.push({ text: 'game.main.roulette.challenger.no', fillStyle: 'crimson', weight: 1 });
    }
    for (let i = 0; i < 3; i++) {
      noOdds.push({ text: 'game.main.roulette.challenger.no', fillStyle: 'crimson', weight: 1 });
    }

    this.victoryOdds = interleaveOdds(yesOdds, noOdds);
  }
}
