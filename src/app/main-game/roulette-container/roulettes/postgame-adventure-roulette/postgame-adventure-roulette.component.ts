import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { WheelItem } from '../../../../interfaces/wheel-item';
import { GenerationService } from '../../../../services/generation-service/generation.service';

/**
 * Postgame hub roulette — what happens after the Champion is defeated.
 * Mirrors the structure of MainAdventureRouletteComponent but with the
 * postgame-only options (Battle Tower, Mythical hunt) and reuse of the
 * legendary / paradox / wild / trade activities. The wheel deliberately
 * loops: each landing routes back through the parent which re-queues
 * `postgame-adventure` unless the user picks "Retire".
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
  @Output() catchPokemonEvent = new EventEmitter<void>();
  @Output() tradePokemonEvent = new EventEmitter<void>();
  @Output() findItemEvent = new EventEmitter<void>();
  @Output() battleRivalEvent = new EventEmitter<void>();
  @Output() areaZeroEvent = new EventEmitter<void>();
  @Output() retireEvent = new EventEmitter<void>();

  // Order matters — `onItemSelected` switches on the index.
  // Battle Tower gets `weight: 2` because climbing it is the headline activity.
  // Retire gets `weight: 1` so it isn't oppressively likely to interrupt the loop.
  private readonly baseActions: WheelItem[] = [
    { text: 'game.main.roulette.postgame.actions.battleTower',         fillStyle: 'gold',          weight: 2 }, // 0
    { text: 'game.main.roulette.postgame.actions.legendaryEncounter',  fillStyle: 'crimson',       weight: 1 }, // 1
    { text: 'game.main.roulette.postgame.actions.mythicalEncounter',   fillStyle: 'deeppink',      weight: 1 }, // 2
    { text: 'game.main.roulette.postgame.actions.catchPokemon',        fillStyle: 'darkcyan',      weight: 1 }, // 3
    { text: 'game.main.roulette.postgame.actions.tradePokemon',        fillStyle: 'darkorange',    weight: 1 }, // 4
    { text: 'game.main.roulette.postgame.actions.findItem',            fillStyle: 'darkgoldenrod', weight: 1 }, // 5
    { text: 'game.main.roulette.postgame.actions.battleRival',         fillStyle: 'black',         weight: 1 }, // 6
    { text: 'game.main.roulette.postgame.actions.retire',              fillStyle: 'dimgray',       weight: 1 }, // 7
  ];

  private readonly areaZeroAction: WheelItem = {
    text: 'game.main.roulette.postgame.actions.areaZero',
    fillStyle: 'darkslateblue',
    weight: 1
  }; // 8 (only included on Gen 9 runs)

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
      case 3: this.catchPokemonEvent.emit(); break;
      case 4: this.tradePokemonEvent.emit(); break;
      case 5: this.findItemEvent.emit(); break;
      case 6: this.battleRivalEvent.emit(); break;
      case 7: this.retireEvent.emit(); break;
      case 8: this.areaZeroEvent.emit(); break;
    }
  }
}
