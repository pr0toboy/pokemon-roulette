import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { WheelItem } from '../../../../interfaces/wheel-item';
import { PokemonItem } from '../../../../interfaces/pokemon-item';
import { GameStateService } from '../../../../services/game-state-service/game-state.service';
import { GenerationService } from '../../../../services/generation-service/generation.service';
import { TrainerService } from '../../../../services/trainer-service/trainer.service';
import { interleaveOdds } from '../../../../utils/odd-utils';
import { BaseBattleRouletteComponent } from '../base-battle-roulette/base-battle-roulette.component';

@Component({
  selector: 'app-boss-battle-roulette',
  imports: [
    CommonModule,
    WheelComponent,
    TranslatePipe
  ],
  templateUrl: './boss-battle-roulette.component.html',
  styleUrl: './boss-battle-roulette.component.css'
})
export class BossBattleRouletteComponent extends BaseBattleRouletteComponent {

  @ViewChild('bossPresentationModal', { static: true }) bossPresentationModal!: TemplateRef<any>;
  @ViewChild('itemUsedModal', { static: true }) itemUsedModal!: TemplateRef<any>;

  @Input() boss!: PokemonItem;
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
    this.retries--;
    if (this.victoryOdds[index].text === 'game.main.roulette.boss.yes') {
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
    if (state === 'boss-battle') {
      this.calcVictoryOdds();
      this.modalService.open(this.bossPresentationModal, { centered: true, size: 'lg' });
    }
  }

  // Boss legendaries are post-league capstones — they should feel meaningfully
  // tougher than the Champion. We seed 4 baseline "no" slices and add one per
  // round completed (8 gyms + 4 E4 + 1 champion ⇒ ~13 by post-league), so a
  // post-league team needs real power to break through.
  protected override calcVictoryOdds(): void {
    const yesOdds: WheelItem[] = [];
    const noOdds: WheelItem[] = [];

    yesOdds.push({ text: 'game.main.roulette.boss.yes', fillStyle: 'green', weight: 1 });

    this.trainerTeam.forEach(pokemon => {
      for (let i = 0; i < pokemon.power; i++) {
        yesOdds.push({ text: 'game.main.roulette.boss.yes', fillStyle: 'green', weight: 1 });
      }
    });

    const powerModifier = this.plusModifiers();
    for (let i = 0; i < powerModifier; i++) {
      yesOdds.push({ text: 'game.main.roulette.boss.yes', fillStyle: 'green', weight: 1 });
    }

    const levelBonus = this.calcLevelBonus();
    for (let i = 0; i < levelBonus; i++) {
      yesOdds.push({ text: 'game.main.roulette.boss.yes', fillStyle: 'green', weight: 1 });
    }

    for (let i = 0; i < this.currentRound; i++) {
      noOdds.push({ text: 'game.main.roulette.boss.no', fillStyle: 'crimson', weight: 1 });
    }
    for (let i = 0; i < 4; i++) {
      noOdds.push({ text: 'game.main.roulette.boss.no', fillStyle: 'crimson', weight: 1 });
    }

    this.victoryOdds = interleaveOdds(yesOdds, noOdds);
  }
}
