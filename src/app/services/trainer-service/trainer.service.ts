import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { trainerSpriteData } from './trainer-sprite-data';
import { PokemonItem } from '../../interfaces/pokemon-item';
import { PokemonService } from '../pokemon-service/pokemon.service';
import { EvolutionService } from '../evolution-service/evolution.service';
import { ItemItem } from '../../interfaces/item-item';
import { ItemSpriteService } from '../item-sprite-service/item-sprite.service';
import { ItemName } from '../items-service/item-names';
import { Badge } from '../../interfaces/badge';
import { BadgesService } from '../badges-service/badges.service';
import { GenerationService } from '../generation-service/generation.service';
import { GameState } from '../game-state-service/game-state';
import { GameStateService } from '../game-state-service/game-state.service';
import { palafinForms } from './palafin-forms';
import { stickyBattleForms } from './sticky-battle-forms';
import { TrainerSnapshot } from '../game-save-service/game-save.service';

@Injectable({
  providedIn: 'root'
})
export class TrainerService implements OnDestroy {

  /** Level assigned to a freshly-caught Pokémon. */
  static readonly STARTING_LEVEL = 5;

  /** Cap mirroring the mainline games — no Pokémon goes past level 100. */
  static readonly MAX_LEVEL = 100;

  /** Maximum number of items the trainer can carry — matches the 12-slot UI. */
  static readonly MAX_INVENTORY = 12;

  /** Bonus level granted on top of the inherited one when a Pokémon evolves. */
  private static readonly EVOLUTION_LEVEL_BONUS = 1;

  private static readonly DEFAULT_POTION: ItemItem = {
    text: 'items.potion.name',
    name: 'potion',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',
    fillStyle: 'purple',
    weight: 1,
    description: 'items.potion.description'
  };

  private readonly gameStateSubscription: Subscription;

  constructor(private badgesService: BadgesService,
    private evolutionService: EvolutionService,
    private generationService: GenerationService,
    private itemSpriteService: ItemSpriteService,
    private pokemonService: PokemonService,
    private gameStateService: GameStateService) {
    this.gameStateSubscription = this.gameStateService.currentState.subscribe((gameState) => {
      this.syncBattleForms(gameState);
    });
  }

  trainerSpriteData = trainerSpriteData;

  private trainer = new BehaviorSubject<{ sprite: string }>({ sprite: './place-holder-pixel.png' });
  gender: string = 'male';

  trainerTeam: PokemonItem[] = [];

  storedPokemon: PokemonItem[] = [];

  private trainerTeamObservable = new BehaviorSubject<PokemonItem[]>(this.trainerTeam);
  private lastAddedPokemon: PokemonItem | null = null;
  private readonly battleStates = new Set<GameState>(['gym-battle', 'elite-four-battle', 'champion-battle']);
  private readonly temporaryBattleForms = palafinForms;
  private readonly stickyBattleFormGroups = stickyBattleForms;

  trainerItems: ItemItem[] = [structuredClone(TrainerService.DEFAULT_POTION)];
  private trainerItemsObservable = new BehaviorSubject<ItemItem[]>(this.trainerItems);

  trainerBadges: Badge[] = [];

  private trainerBadgesObservable = new BehaviorSubject<Badge[]>(this.trainerBadges);

  ngOnDestroy(): void {
    this.gameStateSubscription.unsubscribe();
  }

  getTrainer(): Observable<{ sprite: string }> {
    return this.trainer.asObservable();
  }

  getTrainerSprite(generation: number, gender: string): string {
    return this.trainerSpriteData[generation][gender];
  }

  setTrainer(generation: number, gender: string) {
    this.gender = gender;
    this.trainer.next({ sprite: this.getTrainerSprite(generation, gender) });
  }

  addToTeam(pokemon: PokemonItem): void {

    pokemon = structuredClone(pokemon);
    this.loadPokemonSpriteIfMissing(pokemon);

    // Seed Pokédex entries don't carry a level; assign one on capture.
    if (pokemon.level === undefined) {
      pokemon.level = TrainerService.STARTING_LEVEL;
    }

    if(this.trainerTeam.length < 6) {
      this.trainerTeam.push(pokemon);
    } else {
      this.storedPokemon.push(pokemon);
    }

    this.lastAddedPokemon = pokemon;
    this.trainerTeamObservable.next(this.getTeam());
  }

  /**
   * Grants `amount` levels to every Pokémon currently in the active team.
   * Stored Pokémon don't gain XP since they don't participate in battles.
   */
  levelUpTeam(amount: number): void {
    if (amount <= 0 || this.trainerTeam.length === 0) {
      return;
    }
    this.trainerTeam.forEach(pokemon => {
      const current = pokemon.level ?? TrainerService.STARTING_LEVEL;
      pokemon.level = Math.min(TrainerService.MAX_LEVEL, current + amount);
    });
    this.trainerTeamObservable.next(this.getTeam());
  }

  removeFromTeam(pokemon: PokemonItem): void {
    let index = this.trainerTeam.indexOf(pokemon);

    if (index !== -1) {
      this.trainerTeam.splice(index, 1);
    } else {
      index = this.storedPokemon.indexOf(pokemon);
      if(index !== -1) {
        this.storedPokemon.splice(index, 1);
      }
    }

    this.trainerTeamObservable.next(this.getTeam());
  }

  getTeam(): PokemonItem[] {
    return [...this.trainerTeam];
  }

  updateTeam(): void {
    this.trainerTeamObservable.next(this.getTeam());
  }

  commitTeamAndStorage(team: PokemonItem[], stored: PokemonItem[]): void {
    this.trainerTeam = [...team];
    this.storedPokemon = [...stored];
    this.trainerTeamObservable.next(this.getTeam());
  }

  getStored(): PokemonItem[] {
    return [...this.storedPokemon];
  }

  getTeamObservable(): Observable<PokemonItem[]> {
    return this.trainerTeamObservable.asObservable();
  }

  makeShiny(): void {
    const lastAddedIndex = this.trainerTeam.findIndex(pokemon => pokemon === this.lastAddedPokemon);
    if (lastAddedIndex !== -1) {
      this.trainerTeam[lastAddedIndex].shiny = true;
    } else {
      const storedIndex = this.storedPokemon.findIndex(pokemon => pokemon === this.lastAddedPokemon);
      if (storedIndex !== -1) {
        this.storedPokemon[storedIndex].shiny = true;
      }
    }
    this.trainerTeamObservable.next(this.getTeam());
  }

  getPokemonThatCanEvolve(): PokemonItem[] {
    const auxPokemonList: PokemonItem[] = [];
    this.trainerTeam.forEach(pokemon => {
      if (this.evolutionService.canEvolve(pokemon)) {
        auxPokemonList.push(pokemon);
      }
    });
    return auxPokemonList;
  }

  private syncBattleForms(gameState: GameState): void {
    if (this.battleStates.has(gameState)) {
      this.applyBattleForms();
      return;
    }

    this.revertBattleForms();
  }

  replaceForEvolution(pokemonOut: PokemonItem, pokemonIn: PokemonItem): void {
    pokemonIn.shiny = pokemonOut.shiny;
    // Carry the evolution chain's training: keep the level and add a small bonus
    // so evolution feels rewarding without distorting the curve.
    const inheritedLevel = pokemonOut.level ?? TrainerService.STARTING_LEVEL;
    pokemonIn.level = Math.min(
      TrainerService.MAX_LEVEL,
      inheritedLevel + TrainerService.EVOLUTION_LEVEL_BONUS,
    );
    this.loadPokemonSpriteIfMissing(pokemonIn);

    let index = this.trainerTeam.indexOf(pokemonOut);

    if (index > -1) {
      this.trainerTeam.splice(index, 1, pokemonIn);
    } else {
      index = this.storedPokemon.indexOf(pokemonOut);
      if (index > -1) {
        this.storedPokemon.splice(index, 1, pokemonIn);
      }
    }

    this.trainerTeamObservable.next(this.getTeam());
  }

  performTrade(pokemonOut: PokemonItem, pokemonIn: PokemonItem): void {
    // Trades are typically considered fair-value: the incoming Pokémon takes
    // over the slot at the same training level as the one we're giving away.
    pokemonIn.level = pokemonOut.level ?? TrainerService.STARTING_LEVEL;
    this.loadPokemonSpriteIfMissing(pokemonIn);

    let index = this.trainerTeam.indexOf(pokemonOut);
    if (index > -1) {
      this.trainerTeam.splice(index, 1, pokemonIn);
    } else {
      index = this.storedPokemon.indexOf(pokemonOut);
      if (index > -1) {
        this.storedPokemon.splice(index, 1, pokemonIn);
      }
    }
    this.trainerTeamObservable.next(this.getTeam());
  }

  getItems(): ItemItem[] {
    return this.trainerItems;
  }

  getItemsObservable(): Observable<ItemItem[]> {
    return this.trainerItemsObservable.asObservable();
  }

  hasItem(itemName: ItemName): boolean {
    return this.trainerItems.some(item => item.name === itemName);
  }

  getItem(itemName: ItemName): ItemItem | undefined {
    return this.trainerItems.find(item => item.name === itemName);
  }

  /** Maximum copies the bag accepts for each potion tier — keeps the player
   *  from hoarding 12 hyper-potions and trivialising every battle wheel. */
  private static readonly POTION_TIER_CAP = 5;
  private static readonly POTION_TIERS: ReadonlySet<string> = new Set([
    'potion', 'super-potion', 'hyper-potion',
  ]);

  /**
   * Adds an item to the trainer's bag. Returns false when the bag is already
   * full (12 slots) or when the per-tier cap (5) is reached for potions —
   * callers should treat this as "the drop didn't land" and skip downstream
   * UI like reward popups so the postgame loop doesn't trick the player into
   * thinking they got something they didn't.
   */
  addToItems(item: ItemItem): boolean {
    if (this.trainerItems.length >= TrainerService.MAX_INVENTORY) {
      return false;
    }
    if (TrainerService.POTION_TIERS.has(item.name)) {
      const owned = this.trainerItems.filter(i => i.name === item.name).length;
      if (owned >= TrainerService.POTION_TIER_CAP) {
        return false;
      }
    }

    item = structuredClone(item);

    if (!item.sprite) {
      this.itemSpriteService.getItemSprite(item.name).subscribe(response => {
        item.sprite = response.sprite;
      });
    }
    this.trainerItems.push(item);
    this.trainerItemsObservable.next(this.trainerItems);
    return true;
  }

  removeItem(item: ItemItem): void {
    const index = this.trainerItems.indexOf(item);
    if (index !== -1) {
      this.trainerItems.splice(index, 1);
    }
    this.trainerItemsObservable.next(this.trainerItems);
  }

  getBadgesObservable(): Observable<Badge[]> {
    return this.trainerBadgesObservable.asObservable();
  }

  addBadge(fromRound: number, fromLeader: number = 0): void {
    this.badgesService.getBadge(this.generationService.getCurrentGeneration(), fromRound, fromLeader).subscribe(badge => {
      if (badge === undefined) return;
      this.trainerBadges.push(badge);
      this.trainerBadgesObservable.next(this.trainerBadges);
    })
  }

  resetTrainer() {
    this.trainer.next({ sprite: './place-holder-pixel.png' });
  }

  resetTeam() {
    this.trainerTeam = [];
    this.storedPokemon = [];
    this.trainerTeamObservable.next(this.trainerTeam);
  }

  resetItems() {
    this.trainerItems = [structuredClone(TrainerService.DEFAULT_POTION)];
    this.trainerItemsObservable.next(this.trainerItems);
  }

  resetBadges() {
    this.trainerBadges = [];
    this.trainerBadgesObservable.next(this.trainerBadges);
  }

  serialize(): TrainerSnapshot {
    return {
      gender: this.gender,
      team: structuredClone(this.trainerTeam),
      stored: structuredClone(this.storedPokemon),
      items: structuredClone(this.trainerItems),
      badges: structuredClone(this.trainerBadges),
    };
  }

  restore(snapshot: TrainerSnapshot, generationId: number): void {
    this.gender = snapshot.gender;
    this.trainerTeam = structuredClone(snapshot.team);
    this.storedPokemon = structuredClone(snapshot.stored);
    this.trainerItems = structuredClone(snapshot.items);
    this.trainerBadges = structuredClone(snapshot.badges);

    // Re-emit so subscribers (TrainerTeamComponent, gym/tower roulettes) see
    // the restored team rather than the empty default they observed at boot.
    this.trainer.next({ sprite: this.getTrainerSprite(generationId, this.gender) });
    this.trainerTeamObservable.next(this.getTeam());
    this.trainerItemsObservable.next(this.trainerItems);
    this.trainerBadgesObservable.next(this.trainerBadges);
  }

  // Applies all battle-entry transforms in one pass with a single emit.
  // Temporary forms apply to team+stored; sticky forms apply to team only.
  private applyBattleForms(): void {
    let changed = false;
    changed = this.replaceTemporaryForms(this.trainerTeam, true) || changed;
    changed = this.replaceTemporaryForms(this.storedPokemon, true) || changed;
    changed = this.applyStickyFormsToCollection(this.trainerTeam) || changed;

    if (changed) {
      this.trainerTeamObservable.next(this.getTeam());
    }
  }

  // Reverts temporary forms only. Sticky forms intentionally persist after battle.
  private revertBattleForms(): void {
    let changed = false;
    changed = this.replaceTemporaryForms(this.trainerTeam, false) || changed;
    changed = this.replaceTemporaryForms(this.storedPokemon, false) || changed;

    if (changed) {
      this.trainerTeamObservable.next(this.getTeam());
    }
  }

  private applyStickyFormsToCollection(collection: PokemonItem[]): boolean {
    let replaced = false;

    this.stickyBattleFormGroups.forEach(group => {
      const formIds = new Set(group.forms.map(f => f.pokemonId));

      collection.forEach((pokemon, index) => {
        if (!formIds.has(pokemon.pokemonId)) {
          return;
        }

        const currentFormIndex = group.forms.findIndex(f => f.pokemonId === pokemon.pokemonId);
        let targetForm: PokemonItem;

        if (group.mode === 'toggle') {
          targetForm = group.forms[(currentFormIndex + 1) % group.forms.length];
        } else {
          const otherForms = group.forms.filter(f => f.pokemonId !== pokemon.pokemonId);
          targetForm = otherForms[Math.floor(Math.random() * otherForms.length)];
        }

        const replacement = structuredClone(targetForm);
        replacement.shiny = pokemon.shiny;
        replacement.level = pokemon.level;
        replacement.sprite = null;
        this.loadPokemonSpriteIfMissing(replacement);
        collection[index] = replacement;
        replaced = true;
      });
    });

    return replaced;
  }

  private loadPokemonSpriteIfMissing(pokemon: PokemonItem): void {
    if (!pokemon.sprite) {
      this.pokemonService.getPokemonSprites(pokemon.pokemonId).subscribe(response => {
        pokemon.sprite = response.sprite;
      });
    }
  }

  private replaceTemporaryForms(collection: PokemonItem[], transformToBattleForm: boolean): boolean {
    let replaced = false;

    Object.values(this.temporaryBattleForms).forEach(forms => {
      if (forms.length < 2) {
        return;
      }

      const baseForm = forms[0];
      const battleForm = forms[1];
      const sourceId = transformToBattleForm ? baseForm.pokemonId : battleForm.pokemonId;
      const targetForm = transformToBattleForm ? battleForm : baseForm;

      collection.forEach((pokemon, index) => {
        if (pokemon.pokemonId !== sourceId) {
          return;
        }

        const replacement = structuredClone(targetForm);
        replacement.shiny = pokemon.shiny;
        replacement.level = pokemon.level;
        replacement.sprite = null;
        this.loadPokemonSpriteIfMissing(replacement);
        collection[index] = replacement;
        replaced = true;
      });
    });

    return replaced;
  }
}

