import { Component, DestroyRef, EventEmitter, inject, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GenerationRouletteComponent } from "./roulettes/generation-roulette/generation-roulette.component";
import { GameStateService } from '../../services/game-state-service/game-state.service';
import { GameState } from '../../services/game-state-service/game-state';
import { EventSource } from '../EventSource';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrainerService } from '../../services/trainer-service/trainer.service';
import { PokedexService } from '../../services/pokedex-service/pokedex.service';
import { PokemonService } from '../../services/pokemon-service/pokemon.service';
import { ItemsService } from '../../services/items-service/items.service';
import { EvolutionService } from '../../services/evolution-service/evolution.service';
import { CommonModule } from '@angular/common';
import { SoundFxHandle, SoundFxService } from '../../services/sound-fx-service/sound-fx.service';
import { SettingsService } from '../../services/settings-service/settings.service';
import { RareCandyService } from '../../services/rare-candy-service/rare-candy.service';
import { MegaEvolutionService, MegaForm } from '../../services/mega-evolution-service/mega-evolution.service';
import { Subscription } from 'rxjs';
import { CharacterSelectComponent } from "./roulettes/character-select/character-select.component";
import { StarterRouletteComponent } from "./roulettes/starter-roulette/starter-roulette.component";
import { PokemonItem } from '../../interfaces/pokemon-item';
import { PokemonForm } from '../../interfaces/pokemon-form';
import { ItemItem } from '../../interfaces/item-item';
import { ShinyRouletteComponent } from "./roulettes/shiny-roulette/shiny-roulette.component";
import { StartAdventureRouletteComponent } from "./roulettes/start-adventure-roulette/start-adventure-roulette.component";
import { ItemName } from '../../services/items-service/item-names';
import { PokemonFromGenerationRouletteComponent } from "./roulettes/pokemon-from-generation-roulette/pokemon-from-generation-roulette.component";
import { PokemonFromAuxListRouletteComponent } from "./roulettes/pokemon-from-aux-list-roulette/pokemon-from-aux-list-roulette.component";
import { GymBattleRouletteComponent } from "./roulettes/gym-battle-roulette/gym-battle-roulette.component";
import { CheckEvolutionRouletteComponent } from "./roulettes/check-evolution-roulette/check-evolution-roulette.component";
import { MainAdventureRouletteComponent } from "./roulettes/main-adventure-roulette/main-adventure-roulette.component";
import { TeamRocketRouletteComponent } from "./roulettes/team-rocket-roulette/team-rocket-roulette.component";
import { MysteriousEggRouletteComponent } from "./roulettes/mysterious-egg-roulette/mysterious-egg-roulette.component";
import { LegendaryRouletteComponent } from "./roulettes/legendary-roulette/legendary-roulette.component";
import { CatchLegendaryRouletteComponent } from "./roulettes/catch-legendary-roulette/catch-legendary-roulette.component";
import { SelectFormRouletteComponent } from './roulettes/select-form-roulette/select-form-roulette.component';
import { TradePokemonRouletteComponent } from "./roulettes/trade-pokemon-roulette/trade-pokemon-roulette.component";
import { FindItemRouletteComponent } from "./roulettes/find-item-roulette/find-item-roulette.component";
import { ExploreCaveRouletteComponent } from "./roulettes/explore-cave-roulette/explore-cave-roulette.component";
import { CavePokemonRouletteComponent } from "./roulettes/cave-pokemon-roulette/cave-pokemon-roulette.component";
import { FossilRouletteComponent } from "./roulettes/fossil-roulette/fossil-roulette.component";
import { AreaZeroRoulette } from "./roulettes/area-zero-roulette/area-zero-roulette";
import { CatchParadoxRouletteComponent } from "./roulettes/catch-paradox-roulette/catch-paradox-roulette.component";
import { OtherworldRouletteComponent } from "./roulettes/otherworld-roulette/otherworld-roulette.component";
import { UltraBeastRouletteComponent } from "./roulettes/ultra-beast-roulette/ultra-beast-roulette.component";
import { SnorlaxRouletteComponent } from "./roulettes/snorlax-roulette/snorlax-roulette.component";
import { FishingRouletteComponent } from "./roulettes/fishing-roulette/fishing-roulette.component";
import { RivalBattleRouletteComponent } from "./roulettes/rival-battle-roulette/rival-battle-roulette.component";
import { EliteFourPrepRouletteComponent } from "./roulettes/elite-four-prep-roulette/elite-four-prep-roulette.component";
import { EliteFourBattleRouletteComponent } from "./roulettes/elite-four-battle-roulette/elite-four-battle-roulette.component";
import { ChampionBattleRouletteComponent } from "./roulettes/champion-battle-roulette/champion-battle-roulette.component";
import { PostgameAdventureRouletteComponent } from "./roulettes/postgame-adventure-roulette/postgame-adventure-roulette.component";
import { BattleTowerRouletteComponent } from "./roulettes/battle-tower-roulette/battle-tower-roulette.component";
import { MasterChallengerRouletteComponent } from "./roulettes/master-challenger-roulette/master-challenger-roulette.component";
import { ShopGiveRouletteComponent } from "./roulettes/shop-roulette/shop-give-roulette.component";
import { ShopGetRouletteComponent } from "./roulettes/shop-roulette/shop-get-roulette.component";
import { VillainBattleRouletteComponent } from "./roulettes/villain-battle-roulette/villain-battle-roulette.component";
import { MythicalEncounterRouletteComponent } from "./roulettes/mythical-encounter-roulette/mythical-encounter-roulette.component";
import { CatchMythicalRouletteComponent } from "./roulettes/catch-mythical-roulette/catch-mythical-roulette.component";
import { BossEncounterRouletteComponent } from "./roulettes/boss-encounter-roulette/boss-encounter-roulette.component";
import { BossBattleRouletteComponent } from "./roulettes/boss-battle-roulette/boss-battle-roulette.component";
import { CatchBossRouletteComponent } from "./roulettes/catch-boss-roulette/catch-boss-roulette.component";
import { bossByGeneration } from "./roulettes/boss-encounter-roulette/bosses-by-generation";
import { GenerationService } from "../../services/generation-service/generation.service";
import { EndGameComponent } from "../end-game/end-game.component";
import { GameOverComponent } from "../game-over/game-over.component";
import { ModalQueueService } from '../../services/modal-queue-service/modal-queue.service';
import { PokemonFormsService } from '../../services/pokemon-forms-service/pokemon-forms.service';
import { GameSaveService } from '../../services/game-save-service/game-save.service';

@Component({
  selector: 'app-roulette-container',
  imports: [
    CommonModule,
    TranslatePipe,
    GenerationRouletteComponent,
    CharacterSelectComponent,
    StarterRouletteComponent,
    ShinyRouletteComponent,
    StartAdventureRouletteComponent,
    PokemonFromGenerationRouletteComponent,
    PokemonFromAuxListRouletteComponent,
    SelectFormRouletteComponent,
    GymBattleRouletteComponent,
    CheckEvolutionRouletteComponent,
    MainAdventureRouletteComponent,
    TeamRocketRouletteComponent,
    MysteriousEggRouletteComponent,
    LegendaryRouletteComponent,
    CatchLegendaryRouletteComponent,
    TradePokemonRouletteComponent,
    FindItemRouletteComponent,
    ExploreCaveRouletteComponent,
    CavePokemonRouletteComponent,
    FossilRouletteComponent,
    AreaZeroRoulette,
    CatchParadoxRouletteComponent,
    OtherworldRouletteComponent,
    UltraBeastRouletteComponent,
    SnorlaxRouletteComponent,
    FishingRouletteComponent,
    RivalBattleRouletteComponent,
    EliteFourPrepRouletteComponent,
    EliteFourBattleRouletteComponent,
    ChampionBattleRouletteComponent,
    PostgameAdventureRouletteComponent,
    BattleTowerRouletteComponent,
    MasterChallengerRouletteComponent,
    ShopGiveRouletteComponent,
    ShopGetRouletteComponent,
    VillainBattleRouletteComponent,
    MythicalEncounterRouletteComponent,
    CatchMythicalRouletteComponent,
    BossEncounterRouletteComponent,
    BossBattleRouletteComponent,
    CatchBossRouletteComponent,
    EndGameComponent,
    GameOverComponent
],
  templateUrl: './roulette-container.component.html',
  styleUrl: './roulette-container.component.css'
})
export class RouletteContainerComponent implements OnInit, OnDestroy {

    @Output() resetGameEvent = new EventEmitter<void>();

    private destroyRef = inject(DestroyRef);
    private rareCandySubscription?: Subscription;
    private megaStoneSubscription?: Subscription;

    constructor(
      private evolutionService: EvolutionService,
      private gameStateService: GameStateService,
      private itemService: ItemsService,
      private pokemonService: PokemonService,
      private pokedexService: PokedexService,
      private translateService: TranslateService,
      private trainerService: TrainerService,
      private modalService: NgbModal,
      private modalQueueService: ModalQueueService,
      private soundFxService: SoundFxService,
      private settingsService: SettingsService,
      private pokemonFormsService: PokemonFormsService,
      private rareCandyService: RareCandyService,
      private megaEvolutionService: MegaEvolutionService,
      private gameSaveService: GameSaveService,
      private generationService: GenerationService) {
      this.itemFoundAudio = this.soundFxService.createItemFoundSoundFx();
    }

    ngOnInit(): void {
      this.gameStateService.currentState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(state => {
        this.currentGameState = state;
        if (this.currentGameState === 'adventure-continues' || this.currentGameState === 'postgame-adventure') {
          if (this.multitaskCounter > 0) {
            this.respinReason = 'Multitask x' + this.multitaskCounter;
            this.multitaskCounter--;
          }
          if (this.runningShoesUsed) {
            this.respinReason = 'items.running-shoes.name';
          }
        }
      });

    this.gameStateService.currentRoundObserver.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(round => {
      this.leadersDefeatedAmount = round;
    });

    this.gameStateService.wheelSpinningObserver.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(state => {
      this.wheelSpinning = state;
    });

    // Subscribe to rare candy evolution trigger
    this.rareCandySubscription = this.rareCandyService.rareCandyTrigger$.subscribe((rareCandy) => {
      this.handleRareCandyEvolution(rareCandy);
    });

    this.megaStoneSubscription = this.megaEvolutionService.megaStoneTrigger$.subscribe((megaStone) => {
      this.handleMegaStoneEvolution(megaStone);
    });
  }

  ngOnDestroy(): void {
    this.rareCandySubscription?.unsubscribe();
    this.megaStoneSubscription?.unsubscribe();
  }

  handleRareCandyEvolution(rareCandy: ItemItem): void {
    const pokemonThatCanEvolve = this.trainerService.getPokemonThatCanEvolve();

    if (pokemonThatCanEvolve.length > 0) {
      this.gameStateService.repeatCurrentState();
      this.trainerService.removeItem(rareCandy);
      this.chooseWhoWillEvolve('rare-candy');
    }
  }

  /**
   * Tracks which item was used in the current transformation flow so that
   * `select-mega-form` (after the player picks a Pokémon from the wheel)
   * can re-filter the available forms by that item.
   */
  private activeTransformItem: string = 'mega-stone';

  handleMegaStoneEvolution(megaStone: ItemItem): void {
    const itemName = megaStone.name;
    this.activeTransformItem = itemName;
    const team = this.trainerService.getTeam();
    const alreadyHasMega = team.some(p => this.megaEvolutionService.isMegaForm(p.pokemonId));

    if (alreadyHasMega) {
      this.infoModalTitle = this.translateService.instant('game.main.megaStone.alreadyMega.title');
      this.infoModalMessage = this.translateService.instant('game.main.megaStone.alreadyMega.message');
      this.modalQueueService.open(this.infoModal, { centered: true, size: 'md' });
      return;
    }

    const candidates = team.filter(p => this.megaEvolutionService.canMegaEvolve(p, itemName));
    if (candidates.length === 0) {
      this.infoModalTitle = this.translateService.instant('game.main.megaStone.noCandidates.title');
      this.infoModalMessage = this.translateService.instant('game.main.megaStone.noCandidates.message');
      this.modalQueueService.open(this.infoModal, { centered: true, size: 'md' });
      return;
    }

    this.gameStateService.repeatCurrentState();
    this.trainerService.removeItem(megaStone);

    if (candidates.length === 1) {
      this.startMegaEvolution(candidates[0]);
      return;
    }

    this.auxPokemonList = candidates;
    this.customWheelTitle = 'game.main.roulette.megaEvolve.who';
    this.gameStateService.setNextState('mega-evolve');
    this.gameStateService.setNextState('select-from-pokemon-list');
    this.gameStateService.finishCurrentState();
  }

  private startMegaEvolution(pokemon: PokemonItem): void {
    const forms = this.megaEvolutionService.getMegaForms(pokemon, this.activeTransformItem);
    if (forms.length === 0) {
      return;
    }
    if (forms.length === 1) {
      this.applyMegaEvolution(pokemon, forms[0]);
      return;
    }
    this.currentContextPokemon = pokemon;
    this.auxPokemonList = forms.map(form => this.megaEvolutionService.applyMegaForm(pokemon, form));
    this.customWheelTitle = 'game.main.roulette.megaEvolve.which';
    this.gameStateService.setNextState('select-mega-form');
    this.gameStateService.setNextState('select-from-pokemon-list');
    this.gameStateService.finishCurrentState();
  }

  private applyMegaEvolution(pokemonOut: PokemonItem, form: MegaForm): void {
    const pokemonIn = this.megaEvolutionService.applyMegaForm(pokemonOut, form);
    this.pkmnOut = pokemonOut;
    this.pkmnIn = pokemonIn;
    this.pkmnEvoTitle = 'game.main.roulette.megaEvolve.modal.title';
    this.registerInPokedex(pokemonIn);
    this.trainerService.replaceForEvolution(pokemonOut, pokemonIn);
    this.showpkmnEvoModal();
  }

  @ViewChild('altPrizeModal', { static: true }) altPrizeModal!: TemplateRef<any>;
  @ViewChild('infoModal', { static: true }) infoModal!: TemplateRef<any>;
  @ViewChild('itemActivateModal', { static: true }) itemActivateModal!: TemplateRef<any>;
  @ViewChild('pkmnEvoModal', { static: true }) pkmnEvoModal!: TemplateRef<any>;
  @ViewChild('pkmnTradeModal', { static: true }) pkmnTradeModal!: TemplateRef<any>;
  @ViewChild('teamRocketFailsModal', { static: true }) teamRocketFailsModal!: TemplateRef<any>;

  altPrizeDescription = '';
  altPrizeSprite = '';
  altPrizeText = '';
  auxPokemonList: PokemonItem[] = [];
  pokemonForms: PokemonForm[] = [];
  currentContextItem!: ItemItem;
  currentContextPokemon!: PokemonItem;
  currentGameState!: GameState;
  customWheelTitle = '';
  evolutionCredits: number = 0;
  expSharePokemon: PokemonItem | null = null;
  expShareUsed: boolean = false;
  fromLeader: number = 0;
  infoModalMessage = '';
  infoModalTitle = '';
  itemFoundAudio!: SoundFxHandle;
  leadersDefeatedAmount: number = 0;
  multitaskCounter: number = 0;
  pkmnEvoTitle = '';
  pkmnIn!: PokemonItem;
  pkmnOut!: PokemonItem;
  pkmnTradeTitle = '';
  respinReason = '';
  runningShoesUsed: boolean = false;
  stolenPokemon!: PokemonItem | null;
  wheelSpinning: boolean = false;
  currentBossPokemon!: PokemonItem;

  /**
   * Postgame Battle Tower floor counter. Persisted via GameSaveService so a
   * page reload mid-postgame doesn't drop the player back to floor 1.
   */
  get towerFloor(): number {
    return this.gameSaveService.getExtra('towerFloor', 1);
  }
  set towerFloor(value: number) {
    this.gameSaveService.setExtra('towerFloor', value);
  }

  getGameState(): string {
    return this.currentGameState;
  }

  private finishCurrentState(): void {

    this.gameStateService.finishCurrentState();

    // Running shoes grant one free respin on the open-ended adventure wheels —
    // adventure-continues during the main run, and the postgame master
    // roulette (Que fait le maître ?) between tower floors. The flag resets
    // when a new round starts elsewhere.
    if (this.currentGameState === 'adventure-continues' || this.currentGameState === 'postgame-adventure') {
      if (this.trainerService.hasItem('running-shoes') && !this.runningShoesUsed) {
        this.runningShoesUsed = true;
        this.gameStateService.setNextState(this.currentGameState);
      }
    }
  }

  handleGenerationSelected(): void {
    this.finishCurrentState();
  }

  handleTrainerSelected(): void {
    this.finishCurrentState();
  }

  capturePokemon(pokemon: PokemonItem): void {
    this.preparePokemonCapture(pokemon);
  }

  setShininess(shiny: boolean): void {
    if (shiny) {
      this.trainerService.makeShiny();
      this.registerInPokedex({ ...this.currentContextPokemon, shiny: true });
    }
    this.finishCurrentState();
  }

  catchPokemon(): void {
    this.gameStateService.setNextState('catch-pokemon');
    this.finishCurrentState();
  }

  chooseWhoWillEvolve(eventSource: EventSource): void {
    this.auxPokemonList = [];

    this.auxPokemonList = this.trainerService.getPokemonThatCanEvolve();

    if (this.auxPokemonList.length === 0) {
      switch (eventSource) {
        case 'gym-battle':
          this.altPrizeText = 'game.main.altPrizes.gymBattle.potion';
          this.altPrizeSprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png';
          this.altPrizeDescription = 'game.main.altPrizes.gymBattle.potionDesc';
          this.modalQueueService.open(this.altPrizeModal, {
            centered: true,
            size: 'md'
          });
          return this.buyPotions();
        case 'visit-daycare':
            this.altPrizeText = 'game.main.altPrizes.visitDaycare.egg';
            this.altPrizeSprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/mystery-egg.png';
            this.altPrizeDescription = 'game.main.altPrizes.visitDaycare.eggDesc';
            this.modalQueueService.open(this.altPrizeModal, {
              centered: true,
              size: 'md'
            });
            return this.mysteriousEgg();
        case 'battle-rival':
          this.altPrizeText = 'game.main.altPrizes.battleRival.item';
          this.altPrizeSprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/unknown.png';
          this.altPrizeDescription = 'game.main.altPrizes.battleRival.itemDesc';
          this.modalQueueService.open(this.altPrizeModal, {
            centered: true,
            size: 'md'
          });
          return this.findItem();
        case 'battle-trainer':
          this.altPrizeText = 'game.main.altPrizes.battleTrainer.potion';
          this.altPrizeSprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png';
          this.altPrizeDescription = 'game.main.altPrizes.battleTrainer.potionDesc';
          this.modalQueueService.open(this.altPrizeModal, {
            centered: true,
            size: 'md'
          });
          return this.buyPotions();
        case 'team-rocket-encounter':
          this.altPrizeText = 'game.main.altPrizes.teamRocket.item';
          this.altPrizeSprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/unknown.png';
          this.altPrizeDescription = 'game.main.altPrizes.teamRocket.itemDesc';
          this.modalQueueService.open(this.altPrizeModal, {
            centered: true,
            size: 'md'
          });
          return this.findItem();
        case 'snorlax-encounter':
          this.altPrizeText = 'game.main.altPrizes.snorlax.item';
          this.altPrizeSprite = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/unknown.png';
          this.altPrizeDescription = 'game.main.altPrizes.snorlax.itemDesc';
          this.modalQueueService.open(this.altPrizeModal, {
            centered: true,
            size: 'md'
          });
          return this.findItem();
        case 'rare-candy':
          return this.doNothing();
        default:
          return this.doNothing();
      }
    }

    if (this.auxPokemonList.length === 1) {
      return this.evolvePokemon(this.auxPokemonList[0]);
    }

    this.customWheelTitle = 'game.main.roulette.evolve.who';
    this.gameStateService.setNextState('evolve-pokemon');
    this.gameStateService.setNextState('select-from-pokemon-list');

    this.finishCurrentState();
  }

  buyPotions(): void {
    let itemName: ItemName = 'potion';

    if (this.leadersDefeatedAmount > 6) {
      itemName = 'hyper-potion';
    } else if (this.leadersDefeatedAmount > 3) {
      itemName = 'super-potion';
    }

    this.trainerService.addToItems(this.itemService.getItem(itemName));
    this.playItemFoundAudio();
    this.finishCurrentState();
  }

  doNothing(): void {
    this.finishCurrentState();
  }

  mysteriousEgg(): void {
    this.gameStateService.setNextState('mysterious-egg');
    this.finishCurrentState();
  }

  findItem(): void {
    this.gameStateService.setNextState('find-item');
    this.finishCurrentState();
  }

  continueWithPokemon(pokemon: PokemonItem): void {
    this.finishCurrentState();
    switch (this.currentGameState) {
      case 'evolve-pokemon':
        this.evolvePokemon(pokemon);
        break;
      case 'select-evolution':
        this.replaceForEvolution(this.currentContextPokemon, pokemon);
        this.showpkmnEvoModal();
        break;
      case 'steal-pokemon':
        this.stolenPokemon = pokemon;
        this.removeFromTeam(pokemon);
        this.finishCurrentState();
        break;
      case 'trade-pokemon':
        this.currentContextPokemon = pokemon;
        break;
      case 'mega-evolve':
        this.startMegaEvolution(pokemon);
        break;
      case 'select-mega-form': {
        const form = this.megaEvolutionService
          .getMegaForms(this.currentContextPokemon, this.activeTransformItem)
          .find(f => f.pokemonId === pokemon.pokemonId);
        if (form) {
          this.applyMegaEvolution(this.currentContextPokemon, form);
        }
        break;
      }
      default:
        break;
    }
  }

  selectPokemonForm(pokemonForm: PokemonForm): void {
    this.currentContextPokemon = this.pokemonFormsService.applyFormToPokemon(this.currentContextPokemon, pokemonForm);
    this.completePokemonCapture(this.currentContextPokemon);
  }

  secondEvolution(): void {
    this.auxPokemonList = [];

    this.auxPokemonList = this.trainerService.getPokemonThatCanEvolve();

    if (this.expSharePokemon) {
      const index = this.auxPokemonList.indexOf(this.expSharePokemon);
      if (index > -1) {
        this.auxPokemonList.splice(index, 1);
      }
    }

    if (this.auxPokemonList.length === 0) {
      return;
    }

    if (this.auxPokemonList.length === 1) {
      return this.evolveSecondPokemon(this.auxPokemonList[0]);
    }

    this.customWheelTitle = 'game.main.roulette.evolve.whoExpShare';
    this.gameStateService.setNextState('evolve-pokemon');
    this.gameStateService.setNextState('select-from-pokemon-list');
  }

  gymBattleResult(result: boolean): void {
    this.runningShoesUsed = false;
    this.respinReason = '';

    if (result) {
      this.playItemFoundAudio();
      this.trainerService.addBadge(this.leadersDefeatedAmount, this.fromLeader);
      this.trainerService.levelUpTeam(2);
      this.gameStateService.advanceRound();
      this.gameStateService.setNextState('check-evolution');

    } else {
      this.gameStateService.setNextState('game-over');
    }

    this.finishCurrentState();
  }

  catchTwoPokemon(): void {
    this.gameStateService.setNextState('catch-pokemon');
    this.gameStateService.setNextState('catch-pokemon');
    this.finishCurrentState();
  }

  catchThreePokemon(): void {
    this.gameStateService.setNextState('catch-pokemon');
    this.gameStateService.setNextState('catch-pokemon');
    this.gameStateService.setNextState('catch-pokemon');
    this.finishCurrentState();
  }

  teamRocketEncounter(): void {
    this.gameStateService.setNextState('team-rocket-encounter');
    this.finishCurrentState();
  }

  legendaryEncounter(): void {
    this.gameStateService.setNextState('legendary-encounter');
    this.finishCurrentState();
  }

  tradePokemon(): void {
    this.gameStateService.setNextState('trade-pokemon');

    const trainerTeam = this.trainerService.getTeam();

    if (trainerTeam.length === 1) {
      this.currentContextPokemon = trainerTeam[0];
    } else {
      this.auxPokemonList = trainerTeam;
      this.customWheelTitle = 'game.main.roulette.trade.which';
      this.gameStateService.setNextState('select-from-pokemon-list');
    }

    this.finishCurrentState();
  }

  exploreCave(): void {
    this.gameStateService.setNextState('explore-cave');
    this.finishCurrentState();
  }

  snorlaxEncounter(): void {
    this.gameStateService.setNextState('snorlax-encounter');
    this.finishCurrentState();
  }

  multitask(): void {
    this.gameStateService.setNextState('adventure-continues');
    this.gameStateService.setNextState('adventure-continues');
    this.multitaskCounter = this.multitaskCounter + 2;
    this.respinReason = 'Multitask x' + this.multitaskCounter;
    this.finishCurrentState();
  }

  goFishing(): void {
    this.gameStateService.setNextState('go-fishing');
    this.finishCurrentState();
  }

  findFossil(): void {
    this.gameStateService.setNextState('find-fossil');
    this.finishCurrentState();
  }

  areaZero(): void {
    this.gameStateService.setNextState('area-zero');
    this.finishCurrentState();
  }

  otherworldEncounter(): void {
    this.gameStateService.setNextState('otherworld-encounter');
    this.finishCurrentState();
  }

  otherworldParadoxPath(): void {
    this.gameStateService.setNextState('area-zero');
    this.finishCurrentState();
  }

  otherworldUltraBeastPath(): void {
    this.gameStateService.setNextState('ultra-beast-encounter');
    this.finishCurrentState();
  }

  isUltraBeastCapture = false;

  paradoxCaptureChance(pokemon: PokemonItem): void {
    this.isUltraBeastCapture = false;
    this.currentContextPokemon = structuredClone(pokemon);
    this.gameStateService.setNextState('catch-paradox');
    this.finishCurrentState();
  }

  ultraBeastCaptureChance(pokemon: PokemonItem): void {
    this.isUltraBeastCapture = true;
    this.currentContextPokemon = structuredClone(pokemon);
    this.gameStateService.setNextState('catch-paradox');
    this.finishCurrentState();
  }

  paradoxCaptureSuccess(): void {
    this.preparePokemonCapture(this.currentContextPokemon);
  }

  battleRival(): void {
    this.gameStateService.setNextState('battle-rival');
    this.finishCurrentState();
  }

  rivalBattleResult(result: boolean): void {
    if (result) {
      this.trainerService.levelUpTeam(1);
      this.chooseWhoWillEvolve('battle-rival');
    } else {
      // Rival is now a real trainer fight: losing ends the run, mirroring
      // gym / E4 / Champion / Challenger. The potion-retry mechanic on the
      // rival wheel gives the player the same out-clause those battles have.
      this.gameStateService.setNextState('game-over');
      this.finishCurrentState();
    }
  }

  stealPokemon(): void {
    const trainerTeam = this.trainerService.getTeam();

    if (trainerTeam.length < 2) {
      this.modalQueueService.open(this.teamRocketFailsModal, {
        centered: true,
        size: 'md'
      }).then(modalRef => {
        modalRef.result.then(() => {
          return this.doNothing();
        }, () => {
          return this.doNothing();
        });
      });
    } else if (this.trainerService.hasItem('escape-rope')) {
      this.useEscapeRope();
    } else {
      this.auxPokemonList = trainerTeam;
      this.customWheelTitle = 'game.main.roulette.teamrocket.steal.which';
      this.gameStateService.setNextState('steal-pokemon');
      this.gameStateService.setNextState('select-from-pokemon-list');
      this.finishCurrentState();
    }
  }

  teamRocketDefeated(): void {
    if (this.stolenPokemon) {
      const pokemonName = this.translateService.instant(this.stolenPokemon.text);

      this.trainerService.addToTeam(this.stolenPokemon);
      this.registerInPokedex(this.stolenPokemon);
      this.infoModalTitle = this.translateService.instant('game.main.roulette.teamrocket.saved.title') + pokemonName + '!';
      this.infoModalMessage = this.translateService.instant('game.main.roulette.teamrocket.saved.recovered') + pokemonName + ' ' + this.translateService.instant('game.main.roulette.teamrocket.saved.from');
      this.stolenPokemon = null;
      this.modalQueueService.open(this.infoModal, {
        centered: true,
        size: 'md'
      });
    }

    this.chooseWhoWillEvolve('team-rocket-encounter');
  }

  legendaryCaptureChance(pokemon: PokemonItem): void {
    this.currentContextPokemon = structuredClone(pokemon);
    this.gameStateService.setNextState('catch-legendary');
    this.finishCurrentState();
  }
  
  legendaryCaptureSuccess(): void {
    this.preparePokemonCapture(this.currentContextPokemon);
  }

  performTrade(pokemon: PokemonItem): void {
    // currentContextPokemon should always be set before reaching this state,
    // but a missing reference would crash the modal template (and silently
    // strand the player on the trade wheel). Bail to the next state instead.
    if (!pokemon || !this.currentContextPokemon) {
      this.finishCurrentState();
      return;
    }

    this.pkmnIn = structuredClone(pokemon);
    this.pkmnOut = this.currentContextPokemon;
    this.pkmnTradeTitle = "game.main.trade.title";
    this.trainerService.performTrade(this.currentContextPokemon, this.pkmnIn);
    this.registerInPokedex(this.pkmnIn);
    this.auxPokemonList = [];
    this.playItemFoundAudio();
    if (this.settingsService.currentSettings.lessExplanations) {
      this.finishCurrentState();
      return;
    }

    this.modalQueueService.open(this.pkmnTradeModal, {
      centered: true,
      size: 'md'
    }).then(
      modalRef => modalRef.result.finally(() => this.finishCurrentState()),
      () => this.finishCurrentState(),
    );
  }

  receiveItem(item: ItemItem): void {
    this.trainerService.addToItems(item);
    this.finishCurrentState();
  }

  catchCavePokemon(): void {
    this.gameStateService.setNextState('catch-cave-pokemon');
    this.finishCurrentState();
  }

  findMegaStone(): void {
    const megaStone = this.itemService.getItem('mega-stone');
    this.playItemFoundAudio();
    const outcome = this.tryAddItemWithPriority(megaStone);

    if (outcome !== 'accepted') {
      // 'deferred' → the discard wheel handles the swap + reward popup;
      // 'skipped' → can't actually happen for mega-stone (priority), but
      // bail safely either way. The activate-now prompt is reserved for
      // direct drops; the discard path uses the regular reward modal.
      this.finishCurrentState();
      return;
    }

    this.currentContextItem = this.trainerService.getItem('mega-stone') ?? megaStone;
    if (!this.settingsService.currentSettings.lessExplanations) {
      this.modalQueueService.open(this.itemActivateModal, {
        centered: true,
        size: 'md'
      }).then(modalRef => {
        modalRef.result.then(() => this.finishCurrentState(), () => this.finishCurrentState());
      });
    } else {
      this.finishCurrentState();
    }
  }

  getLost(): void {
    if (this.trainerService.hasItem('escape-rope')) {
      this.useEscapeRope();
    } else {
      return this.doNothing();
    }
  }

  catchZubat(): void {
    const zubat = this.pokemonService.getPokemonById(41);
    if (zubat) {
      this.preparePokemonCapture(zubat);
      return;
    }
    this.finishCurrentState();
  }

  catchSnorlax(): void {
    const snorlax = this.pokemonService.getPokemonById(143);
    if (snorlax) {
      this.preparePokemonCapture(snorlax);
      return;
    }
    this.finishCurrentState();
  }

  eliteFourBattleResult(result: boolean): void {
    this.runningShoesUsed = false;
    this.respinReason = '';

    if (result) {
      this.trainerService.levelUpTeam(3);
      this.gameStateService.advanceRound();
      this.gameStateService.setNextState('check-evolution');
    } else {
      this.gameStateService.setNextState('game-over');
    }
    this.finishCurrentState();
  }

  championBattleResult(result: boolean): void {
    this.runningShoesUsed = false;
    this.respinReason = '';

    if (result) {
      this.trainerService.levelUpTeam(5);
      const rawIds = [
        ...this.trainerService.getTeam().map(p => p.pokemonId),
        ...this.trainerService.getStored().map(p => p.pokemonId)
      ];
      const wonIds = [...new Set(rawIds.flatMap(id => {
        const baseId = this.pokemonFormsService.getBasePokemonId(id);
        return baseId !== null && baseId !== id ? [id, baseId] : [id];
      }))];
      this.pokedexService.markWon(wonIds);
      this.gameStateService.advanceRound();

      // Hall of Fame ceremony, then unlock the postgame loop instead of going
      // straight to credits. The 'game-finish' state stays at the bottom of
      // the stack — picking "Retire" from the postgame wheel pops back to it.
      this.infoModalTitle = this.translateService.instant('game.main.roulette.postgame.hallOfFame.title');
      this.infoModalMessage = this.translateService.instant('game.main.roulette.postgame.hallOfFame.message');
      this.modalQueueService.open(this.infoModal, { centered: true, size: 'md' });
      this.startBossEncounter();
    } else {
      this.gameStateService.setNextState('game-over');
    }

    this.finishCurrentState();
  }

  // Queues the boss legendary encounter on top of the postgame loop. After the
  // boss is resolved the player lands on the Battle Tower (the headline
  // postgame loop), with the "Que fait le maître ?" master roulette queued
  // beneath so subsequent tower victories cycle through it.
  private startBossEncounter(): void {
    this.gameStateService.setNextState('postgame-adventure');
    this.gameStateService.setNextState('battle-tower');
    const gen = this.generationService.getCurrentGeneration();
    if ((bossByGeneration[gen.id] ?? []).length > 0) {
      this.gameStateService.setNextState('boss-encounter');
    }
  }

  bossEncounterChosen(pokemon: PokemonItem): void {
    this.currentBossPokemon = structuredClone(pokemon);
    this.gameStateService.setNextState('boss-battle');
    this.finishCurrentState();
  }

  bossBattleResult(result: boolean): void {
    if (result) {
      this.trainerService.levelUpTeam(3);
      this.gameStateService.setNextState('catch-boss');
    } else if (this.isTowerBoss) {
      // Floor 15 tower rematch: defeat ends the run, same rule as the
      // villain fight / regular tower defeat.
      this.isTowerBoss = false;
      this.gameStateService.setNextState('game-over');
    }
    this.finishCurrentState();
  }

  bossCatchSuccess(): void {
    if (this.isTowerBoss) {
      // Tower rematch counts as clearing a tower floor — bump the counter so
      // the loop resumes at floor 16 next time the player hits the tower.
      this.towerFloor++;
      this.isTowerBoss = false;
    }
    this.preparePokemonCapture(this.currentBossPokemon);
  }

  // ---------- POSTGAME ----------

  /**
   * Queues the next "tower step" under the master-roulette pick. Floor 5 swaps
   * to the villain fight, floor 15 to the boss rematch, every other floor is
   * the regular tower wheel. After the step resolves it pops back to the
   * master roulette (which battleTowerResult re-pushes on victory).
   */
  private queueTowerAfterAction(): void {
    if (this.towerFloor === RouletteContainerComponent.TOWER_VILLAIN_FLOOR) {
      this.gameStateService.setNextState('villain-battle');
    } else if (this.towerFloor === RouletteContainerComponent.TOWER_BOSS_REMATCH_FLOOR) {
      this.isTowerBoss = true;
      this.gameStateService.setNextState('boss-encounter');
    } else {
      this.gameStateService.setNextState('battle-tower');
    }
  }

  villainBattleResult(result: boolean): void {
    this.runningShoesUsed = false;
    if (result) {
      this.trainerService.levelUpTeam(3);
      this.towerFloor++;
      this.respinReason = 'game.main.roulette.villain.victoryMsg';
      this.playItemFoundAudio();
      const masterBall = this.itemService.getItem('master-ball');
      this.gameStateService.setNextState('postgame-adventure');
      const outcome = this.tryAddItemWithPriority(masterBall);
      if (outcome === 'accepted') {
        this.altPrizeText = 'game.main.roulette.villain.reward';
        this.altPrizeSprite = masterBall.sprite;
        this.altPrizeDescription = masterBall.description;
        this.modalQueueService.open(this.altPrizeModal, { centered: true, size: 'md' });
      }
      this.finishCurrentState();
    } else {
      // Defeat to the gen's villain ends the run — mirrors the Challenger /
      // tower-defeat rules so the milestone fight has real weight.
      this.gameStateService.setNextState('game-over');
      this.finishCurrentState();
    }
  }

  /** Tower floor that hands out Porygon (with a shiny roll) in place of the
   *  regular item drop — a milestone reward for clearing the first 10 floors. */
  private static readonly TOWER_PORYGON_FLOOR = 10;
  private static readonly PORYGON_ID = 137;

  /** Tower floor that hands out the Shiny Charm — triples the shiny rate
   *  (1/64 → 1/16) for every capture afterwards. */
  private static readonly TOWER_SHINY_CHARM_FLOOR = 20;

  /** Tower floor that swaps the regular fight for the gen's marquee villain
   *  (Cyrus, Lysandre…) — a ~30% win rate fight rewarding a Master Ball. */
  private static readonly TOWER_VILLAIN_FLOOR = 5;

  /** Tower floor that runs the post-league boss flow a second time. */
  private static readonly TOWER_BOSS_REMATCH_FLOOR = 15;

  /** Flag set while the post-league boss flow is being re-triggered from the
   *  tower (floor 15). Lets bossBattleResult / bossCatchSuccess apply
   *  tower-specific consequences (towerFloor++, game-over on defeat). */
  private isTowerBoss = false;

  get hasShinyCharm(): boolean {
    return this.trainerService.hasItem('shiny-charm');
  }

  battleTowerResult(result: boolean): void {
    // Reset the running-shoes flag the same way every other battle handler
    // does (gym / E4 / champion). Without this the shoes only ever fire once
    // per run instead of giving the player a free respin on every master
    // roulette between tower floors.
    this.runningShoesUsed = false;
    if (result) {
      this.trainerService.levelUpTeam(3);
      this.respinReason = 'game.main.roulette.tower.victory';
      this.playItemFoundAudio();

      if (this.towerFloor === RouletteContainerComponent.TOWER_PORYGON_FLOOR) {
        // Floor 10 milestone: instead of an item, hand the player Porygon and
        // route through the check-shininess wheel. We queue the master
        // roulette underneath so the postgame loop resumes once the capture
        // (and shiny roll) resolves.
        this.towerFloor++;
        this.gameStateService.setNextState('postgame-adventure');
        this.showTowerMilestoneModal(
          'game.main.roulette.tower.milestone.porygon.title',
          'game.main.roulette.tower.milestone.porygon.message',
        );
        const porygon = this.pokemonService.getPokemonById(RouletteContainerComponent.PORYGON_ID);
        if (porygon) {
          this.preparePokemonCapture(porygon);
        } else {
          this.finishCurrentState();
        }
        return;
      }

      if (this.towerFloor === RouletteContainerComponent.TOWER_SHINY_CHARM_FLOOR) {
        // Floor 20 milestone: Shiny Charm. Priority item → if the bag is full
        // the player gets the discard wheel instead of losing the drop.
        const charm = this.itemService.getItem('shiny-charm');
        this.towerFloor++;
        this.gameStateService.setNextState('postgame-adventure');
        this.showTowerMilestoneModal(
          'game.main.roulette.tower.milestone.shinyCharm.title',
          'game.main.roulette.tower.milestone.shinyCharm.message',
        );
        const outcome = this.tryAddItemWithPriority(charm);
        if (outcome === 'accepted') {
          this.altPrizeText = 'game.main.roulette.tower.reward';
          this.altPrizeSprite = charm.sprite;
          this.altPrizeDescription = charm.description;
          this.modalQueueService.open(this.altPrizeModal, { centered: true, size: 'md' });
        }
        this.finishCurrentState();
        return;
      }

      const rewardName = this.battleTowerReward(this.towerFloor);
      const reward = this.itemService.getItem(rewardName);
      this.towerFloor++;
      this.gameStateService.setNextState('postgame-adventure');
      const outcome = this.tryAddItemWithPriority(reward);
      if (outcome === 'accepted') {
        // Show the reward like a regular item drop so the player sees what
        // they earned for the floor.
        this.altPrizeText = 'game.main.roulette.tower.reward';
        this.altPrizeSprite = reward.sprite;
        this.altPrizeDescription = reward.description;
        this.modalQueueService.open(this.altPrizeModal, { centered: true, size: 'md' });
      } else if (outcome === 'skipped') {
        // Non-priority item, bag was full — the postgame loop shouldn't trick
        // the player with a "reward" popup that doesn't land in the bag.
        this.respinReason = 'game.main.roulette.tower.bagFull';
      }
      // 'deferred' → the discard wheel will run before the next master spin
      // and the discard handler will show the reward modal once it lands.
      this.finishCurrentState();
      return;
    } else {
      // Losing in the tower now ends the run — postgame is no longer a
      // sandbox once the player chose to keep climbing.
      this.respinReason = 'game.main.roulette.tower.defeat';
      this.gameStateService.setNextState('game-over');
    }
    this.finishCurrentState();
  }

  /** Opens the celebratory infoModal for tower milestones (Porygon, Shiny
   *  Charm…). Title and message are translation keys. */
  private showTowerMilestoneModal(titleKey: string, messageKey: string): void {
    this.infoModalTitle = this.translateService.instant(titleKey);
    this.infoModalMessage = this.translateService.instant(messageKey);
    this.modalQueueService.open(this.infoModal, { centered: true, size: 'md' });
  }

  // Master-roulette handlers ("Que fait le maître ?"). Each wraps the matching
  // main-game handler with a Battle Tower push so the cycle stays balanced:
  // master → action → tower → master → … until the player picks Retire.
  masterCatchPokemon(): void { this.queueTowerAfterAction(); this.catchPokemon(); }
  masterChallenger(): void {
    // Challenger is a duel-or-die: skip the tower re-queue. On victory we
    // re-push battle-tower; on defeat we push game-over and the run ends.
    this.gameStateService.setNextState('master-challenger');
    this.finishCurrentState();
  }
  masterChallengerResult(result: boolean): void {
    if (result) {
      this.trainerService.levelUpTeam(3);
      this.respinReason = 'game.main.roulette.challenger.victoryMsg';
      this.playItemFoundAudio();
      // Route via the same helper as every master action so the floor-5 /
      // floor-15 milestones still trigger when reached through the Challenger.
      this.queueTowerAfterAction();
    } else {
      // Defeat ends the adventure entirely — postgame is no longer a sandbox
      // once the Challenger is on the wheel.
      this.gameStateService.setNextState('game-over');
    }
    this.finishCurrentState();
  }
  masterBuyPotions(): void { this.queueTowerAfterAction(); this.buyPotions(); }
  masterDoNothing(): void { this.queueTowerAfterAction(); this.doNothing(); }
  masterCatchTwoPokemon(): void { this.queueTowerAfterAction(); this.catchTwoPokemon(); }
  masterVisitDaycare(source: EventSource): void { this.queueTowerAfterAction(); this.chooseWhoWillEvolve(source); }
  masterTeamRocket(): void { this.queueTowerAfterAction(); this.teamRocketEncounter(); }
  masterMysteriousEgg(): void { this.queueTowerAfterAction(); this.mysteriousEgg(); }
  masterLegendaryEncounter(): void { this.queueTowerAfterAction(); this.legendaryEncounter(); }
  masterTradePokemon(): void { this.queueTowerAfterAction(); this.tradePokemon(); }
  masterFindItem(): void { this.queueTowerAfterAction(); this.findItem(); }
  masterExploreCave(): void { this.queueTowerAfterAction(); this.exploreCave(); }
  masterMultitask(): void { this.queueTowerAfterAction(); this.multitask(); }
  masterGoFishing(): void { this.queueTowerAfterAction(); this.goFishing(); }
  masterFindFossil(): void { this.queueTowerAfterAction(); this.findFossil(); }
  masterBattleRival(): void { this.queueTowerAfterAction(); this.battleRival(); }
  masterOtherworldEncounter(): void {
    this.queueTowerAfterAction();
    this.gameStateService.setNextState('otherworld-encounter');
    this.finishCurrentState();
  }
  masterShop(): void {
    // Shop trades one bag item for a fresh one. We queue the master roulette
    // under the shop chain instead of the tower, so the player goes back to
    // the master wheel after the swap and the postgame loop stays intact.
    this.gameStateService.setNextState('battle-tower');
    this.gameStateService.setNextState('shop-get');
    this.gameStateService.setNextState('shop-give');
    this.finishCurrentState();
  }

  private shopItemToReplace: ItemItem | null = null;

  /**
   * Items that always make it into the bag — if the bag is full when one
   * drops, the player picks something to discard via the wheel.
   *
   * Anything that isn't a healing potion is treated as priority: those drops
   * are either uniques (shiny-charm, exp-share, running-shoes), rare event
   * rewards (master-ball, mega-stone, rare-candy), or limited consumables
   * the player relies on (hyperball, x-attack, escape-rope). Potions are
   * deliberately excluded — they're already cap-limited (5 per tier) so a
   * "full bag" silent skip is acceptable for them.
   */
  private static readonly PRIORITY_ITEMS: ReadonlySet<string> = new Set([
    'shiny-charm',
    'master-ball',
    'mega-stone',
    'exp-share',
    'running-shoes',
    'rare-candy',
    'hyperball',
    'x-attack',
    'escape-rope',
  ]);

  private pendingPriorityItem: ItemItem | null = null;

  /**
   * Adds an item, falling back to the discard wheel when the bag is full and
   * the item is on the priority list. Returns one of:
   *   - 'accepted': landed in the bag, caller can show its reward modal.
   *   - 'deferred': bag was full; 'discard-item' state pushed on top. The
   *     caller must NOT show its reward modal — the discard handler will.
   *     Caller should still finishCurrentState as usual; the next pop yields
   *     the discard wheel.
   *   - 'skipped': bag was full and the item isn't priority — silently lost.
   */
  private tryAddItemWithPriority(item: ItemItem): 'accepted' | 'deferred' | 'skipped' {
    const accepted = this.trainerService.addToItems(item);
    if (accepted) {
      return 'accepted';
    }
    if (RouletteContainerComponent.PRIORITY_ITEMS.has(item.name)) {
      this.pendingPriorityItem = item;
      this.gameStateService.setNextState('discard-item');
      return 'deferred';
    }
    return 'skipped';
  }

  discardItemSelected(item: ItemItem): void {
    const pending = this.pendingPriorityItem;
    this.pendingPriorityItem = null;
    if (pending) {
      this.trainerService.removeItem(item);
      this.trainerService.addToItems(pending);
      this.altPrizeText = 'game.main.roulette.shop.received';
      this.altPrizeSprite = pending.sprite;
      this.altPrizeDescription = pending.description;
      this.modalQueueService.open(this.altPrizeModal, { centered: true, size: 'md' });
    }
    this.finishCurrentState();
  }

  shopItemGiven(item: ItemItem): void {
    this.shopItemToReplace = item;
    this.finishCurrentState();
  }

  shopItemReceived(item: ItemItem): void {
    if (this.shopItemToReplace) {
      this.trainerService.removeItem(this.shopItemToReplace);
      this.trainerService.addToItems(item);
      this.altPrizeText = 'game.main.roulette.shop.received';
      this.altPrizeSprite = item.sprite;
      this.altPrizeDescription = item.description;
      this.modalQueueService.open(this.altPrizeModal, { centered: true, size: 'md' });
      this.shopItemToReplace = null;
    }
    this.finishCurrentState();
  }

  // Tower floor rewards: every 5th floor grants a Hyper Ball (rare legendary
  // catch boost), every 3rd floor a Rare Candy, otherwise a healing potion that
  // scales with depth — same escalation idea as buyPotions().
  private battleTowerReward(floor: number): ItemName {
    if (floor % 5 === 0) return 'hyperball';
    if (floor % 3 === 0) return 'rare-candy';
    if (floor < 4) return 'potion';
    if (floor < 8) return 'super-potion';
    return 'hyper-potion';
  }

  mythicalCaptureChance(pokemon: PokemonItem): void {
    this.currentContextPokemon = structuredClone(pokemon);
    this.gameStateService.setNextState('catch-mythical');
    this.finishCurrentState();
  }

  mythicalCaptureSuccess(): void {
    this.preparePokemonCapture(this.currentContextPokemon);
  }

  retireFromPostgame(): void {
    // When the master roulette is showing, the stack is
    // [game-finish, postgame-adventure] (the queued next cycle). We use the
    // raw GameStateService.finishCurrentState here (not the container wrapper)
    // so the running-shoes auto-respin doesn't re-queue the master roulette
    // and trap the player on retire.
    this.respinReason = '';
    this.gameStateService.finishCurrentState();
    this.gameStateService.finishCurrentState();
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  resetGameAction(): void {
    this.evolutionCredits = 0;
    this.towerFloor = 1;
    this.resetGameEvent.emit();
    this.modalService.dismissAll();
  }

  private evolvePokemon(pokemon: PokemonItem): void {
    const pokemonEvolutions = this.evolutionService.getEvolutions(pokemon);

    if (pokemonEvolutions.length === 1) {
      this.replaceForEvolution(pokemon, pokemonEvolutions[0]);
      this.showpkmnEvoModal();
    } else {
      this.auxPokemonList = pokemonEvolutions;
      this.currentContextPokemon = pokemon;
      this.customWheelTitle = 'game.main.roulette.evolve.which';
      this.gameStateService.setNextState('select-evolution');
      this.gameStateService.setNextState('select-from-pokemon-list');
      this.finishCurrentState();
    }
  }

  private preparePokemonCapture(pokemon: PokemonItem): void {
    if (this.pokemonFormsService.hasForms(pokemon)) {
      const pokemonForms = this.pokemonFormsService.getPokemonForms(pokemon);
      
      if (pokemonForms.length > 1) {
        this.currentContextPokemon = structuredClone(pokemon);
        this.pokemonForms = pokemonForms;
        this.gameStateService.setNextState('select-form');
        this.finishCurrentState();
        return;
      }
      
    }
    this.completePokemonCapture(pokemon);
    return;
  }

  private completePokemonCapture(pokemon: PokemonItem): void {
    this.currentContextPokemon = pokemon; // ensures setShininess can reference captured pokemon
    this.trainerService.addToTeam(pokemon);
    this.registerInPokedex(pokemon);

    if (this.settingsService.currentSettings.skipShinyRolls) {
      const shinyRate = this.hasShinyCharm ? 1 / 16 : 1 / 64;
      const isShiny = Math.random() < shinyRate;
      this.setShininess(isShiny);
      return;
    }

    this.gameStateService.setNextState('check-shininess');
    this.finishCurrentState();
  }

  /**
   * Registers a pokemon in the Pokédex. For alt-form pokemon (pokemonId > 1025),
   * also registers the base national dex entry so it appears in the Pokédex grid.
   */
  private registerInPokedex(pokemon: PokemonItem): void {
    this.pokedexService.markSeen(pokemon.pokemonId, pokemon.shiny);
    const baseId = this.pokemonFormsService.getBasePokemonId(pokemon.pokemonId);
    if (baseId !== null && baseId !== pokemon.pokemonId) {
      this.pokedexService.markSeen(baseId, pokemon.shiny);
    }
  }
  private replaceForEvolution(pokemonOut: PokemonItem, pokemonIn: PokemonItem): void {
    this.pkmnOut = pokemonOut;
    this.pkmnIn = structuredClone(pokemonIn);
    this.registerInPokedex(pokemonIn);
    this.pkmnEvoTitle = "game.main.roulette.evolve.modal.title"
    this.trainerService.replaceForEvolution(this.pkmnOut, this.pkmnIn);

    if (this.trainerService.hasItem('exp-share') && this.expShareUsed === false) {
      this.expShareUsed = true;
      this.expSharePokemon = this.pkmnIn;
      this.secondEvolution();
    } else if (this.trainerService.hasItem('exp-share') && this.expShareUsed === true) {
      this.expShareUsed = false;
      this.expSharePokemon = null;
    }
  }

  private evolveSecondPokemon(pokemon: PokemonItem): void {
    const pokemonEvolutions = this.evolutionService.getEvolutions(pokemon);

    if (pokemonEvolutions.length === 1) {
      this.replaceForEvolution(pokemon, pokemonEvolutions[0]);
    } else if (this.evolutionService.isNincadaSpecialEvolution(pokemon)) {
      this.replaceForEvolution(pokemon, pokemonEvolutions[0]);
      this.trainerService.addToTeam(pokemonEvolutions[1]);
      this.registerInPokedex(pokemonEvolutions[1]);
    } else {
      this.auxPokemonList = pokemonEvolutions;
      this.currentContextPokemon = pokemon;
      this.customWheelTitle = 'game.main.roulette.evolve.which';
      this.gameStateService.setNextState('select-evolution');
      this.gameStateService.setNextState('select-from-pokemon-list');
    }
  }

  private removeFromTeam(pokemon: PokemonItem): void {
    this.trainerService.removeFromTeam(pokemon);
    this.auxPokemonList = [];
  }

  private playItemFoundAudio(): void {
    void this.soundFxService.playSoundFx(this.itemFoundAudio, 0.25);
  }

  private showpkmnEvoModal(): void {
    this.playItemFoundAudio();
    if (!this.settingsService.currentSettings.lessExplanations) {
      this.modalQueueService.open(this.pkmnEvoModal, {
        centered: true,
        size: 'md'
      }).then(modalRef => {
        modalRef.result.then(() => {
          this.finishCurrentState();
        }, () => {
          this.finishCurrentState();
        });
      });
    } else {
      this.finishCurrentState();
    }
  }

  private useEscapeRope(): void {
    const item = this.trainerService.getItem('escape-rope');
    if (item) {
      this.trainerService.removeItem(item);
      this.currentContextItem = item;
      this.gameStateService.setNextState('adventure-continues');

      if (!this.settingsService.currentSettings.lessExplanations) {
        this.modalQueueService.open(this.itemActivateModal, {
          centered: true,
          size: 'md'
        }).then(modalRef => {
          modalRef.result.then(() => {
            this.finishCurrentState();
          }, () => {
            this.finishCurrentState();
          });
        });
      } else {
        this.finishCurrentState();
      }
    }
  }
}
