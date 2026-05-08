import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { WheelItem } from '../../../../interfaces/wheel-item';
import { GenerationService } from '../../../../services/generation-service/generation.service';

/**
 * Postgame hub roulette — what happens after the Champion is defeated.
 *
 * Deliberately stripped down to *postgame-exclusive* content: the player
 * already had access to wild catches, item finds, trades and rival fights
 * during the main story. Repeating those options here just made the wheel
 * feel like a remix of the regular adventure. Now it's focused on what only
 * exists post-league: the Battle Tower, Legendary and Mythical hunts, the
 * Gen 9 Paradox sanctuary, and a way out.
 */
@Component({
  selector: 'app-postgame-adventure-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './postgame-adventure-roulette.component.html',
  styleUrl: './postgame-adventure-roulette.component.css'
})
export class PostgameAdventureRouletteComponent implements OnInit, OnDestroy {

  constructor(private generationService: GenerationService) {}

  @Input() respinReason!: string;
  @Input() currentFloor = 1;

  @Output() battleTowerEvent = new EventEmitter<void>();
  @Output() legendaryEncounterEvent = new EventEmitter<void>();
  @Output() mythicalEncounterEvent = new EventEmitter<void>();
  @Output() areaZeroEvent = new EventEmitter<void>();
  @Output() retireEvent = new EventEmitter<void>();

  // Order matters — `onItemSelected` switches on the index.
  // Battle Tower has the heaviest weight: it's the headline postgame loop.
  private readonly baseActions: WheelItem[] = [
    { text: 'game.main.roulette.postgame.actions.battleTower',        fillStyle: 'gold',     weight: 3 }, // 0
    { text: 'game.main.roulette.postgame.actions.legendaryEncounter', fillStyle: 'crimson',  weight: 1 }, // 1
    { text: 'game.main.roulette.postgame.actions.mythicalEncounter',  fillStyle: 'deeppink', weight: 1 }, // 2
    { text: 'game.main.roulette.postgame.actions.retire',             fillStyle: 'dimgray',  weight: 1 }, // 3
  ];

  private readonly areaZeroAction: WheelItem = {
    text: 'game.main.roulette.postgame.actions.areaZero',
    fillStyle: 'darkslateblue',
    weight: 1
  }; // 4 (only included on Gen 9 runs)

  actions: WheelItem[] = [...this.baseActions];
  private generationSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.generationSubscription = this.generationService.getGeneration().subscribe(generation => {
      this.actions = generation.id === 9
        ? [...this.baseActions, this.areaZeroAction]
        : [...this.baseActions];
    });
  }

  ngOnDestroy(): void {
    this.generationSubscription?.unsubscribe();
  }

  onItemSelected(index: number): void {
    switch (index) {
      case 0: this.battleTowerEvent.emit(); break;
      case 1: this.legendaryEncounterEvent.emit(); break;
      case 2: this.mythicalEncounterEvent.emit(); break;
      case 3: this.retireEvent.emit(); break;
      case 4: this.areaZeroEvent.emit(); break;
    }
  }
}
