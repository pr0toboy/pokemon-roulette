import { Injectable } from '@angular/core';
import { GameStateService } from '../game-state-service/game-state.service';
import { GameState } from '../game-state-service/game-state';
import { TrainerService } from '../trainer-service/trainer.service';
import { GenerationService } from '../generation-service/generation.service';
import { PokemonItem } from '../../interfaces/pokemon-item';
import { ItemItem } from '../../interfaces/item-item';
import { Badge } from '../../interfaces/badge';

/** Schema version — bump when GameSnapshot shape changes incompatibly. */
const SAVE_SCHEMA_VERSION = 1 as const;

/** Subset of states where it would be jarring to autosave / restore.
 *  These are short-lived "between two real states" UI moments. If the user
 *  reloads in one of them they fall back to the most recent stable state. */
const TRANSIENT_STATES = new Set<GameState>([
  'select-form',
  'select-from-pokemon-list',
  'select-evolution',
  'check-shininess',
]);

export interface TrainerSnapshot {
  gender: 'male' | 'female' | string;
  team: PokemonItem[];
  stored: PokemonItem[];
  items: ItemItem[];
  badges: Badge[];
}

export interface GameStateSnapshot {
  currentRound: number;
  stateStack: GameState[];
  currentState: GameState;
}

export interface GameSnapshot {
  version: typeof SAVE_SCHEMA_VERSION;
  savedAt: number;          // epoch millis
  generation: number;        // gen id (1-9)
  trainer: TrainerSnapshot;
  game: GameStateSnapshot;
  /** Free-form scratch space owned by RouletteContainerComponent — towerFloor, etc. */
  extras: Record<string, unknown>;
}

/**
 * Persists a full run to localStorage so the player can reload the page
 * without losing progress. Snapshots are written on every `currentState`
 * change (except transient states); they're cleared when the run ends
 * (`game-over` / `game-finish`) or is explicitly reset.
 */
@Injectable({ providedIn: 'root' })
export class GameSaveService {
  private static readonly STORAGE_KEY = 'pokemon-roulette-run-v1';

  private extras: Record<string, unknown> = {};
  private autoSaveStarted = false;

  constructor(
    private gameStateService: GameStateService,
    private trainerService: TrainerService,
    private generationService: GenerationService,
  ) {}

  // ---------- Lifecycle ----------

  /**
   * Subscribes to gameState changes and writes a snapshot on every transition.
   * Idempotent — safe to call from multiple places (only the first call wires up).
   */
  startAutoSave(): void {
    if (this.autoSaveStarted) return;
    this.autoSaveStarted = true;

    this.gameStateService.currentState.subscribe(state => {
      // The default state on app boot before anyone has set anything.
      // We don't want to clobber a real save with this empty snapshot.
      if (state === 'game-start' && !this.hasSave()) return;

      if (state === 'game-over' || state === 'game-finish') {
        // Run is over — wipe the save so a reload starts fresh.
        this.clear();
        return;
      }

      if (TRANSIENT_STATES.has(state)) {
        // Mid-flow micro-state; the previous stable save still represents
        // a valid resume point.
        return;
      }

      this.save();
    });
  }

  // ---------- Extras (scratch space for components) ----------

  setExtra(key: string, value: unknown): void {
    this.extras[key] = value;
  }

  getExtra<T>(key: string, fallback: T): T {
    return (this.extras[key] as T) ?? fallback;
  }

  // ---------- API ----------

  hasSave(): boolean {
    return localStorage.getItem(GameSaveService.STORAGE_KEY) !== null;
  }

  save(): void {
    try {
      const snapshot: GameSnapshot = {
        version: SAVE_SCHEMA_VERSION,
        savedAt: Date.now(),
        generation: this.generationService.getCurrentGeneration().id,
        trainer: this.trainerService.serialize(),
        game: this.gameStateService.serialize(),
        extras: { ...this.extras },
      };
      localStorage.setItem(GameSaveService.STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.error('Failed to save run to localStorage:', error);
    }
  }

  /**
   * Restores a saved run. Order matters: generation first (so trainer sprites
   * resolve with the right region), then trainer, then game-state last so
   * subscribers see a consistent world.
   * Returns true on success, false if no/invalid save existed.
   */
  restore(): boolean {
    const raw = localStorage.getItem(GameSaveService.STORAGE_KEY);
    if (!raw) return false;

    let snapshot: GameSnapshot;
    try {
      snapshot = JSON.parse(raw) as GameSnapshot;
    } catch (error) {
      console.error('Invalid run save in localStorage; discarding.', error);
      this.clear();
      return false;
    }

    if (snapshot?.version !== SAVE_SCHEMA_VERSION) {
      // Old or unknown schema — discard rather than risk a partial restore.
      this.clear();
      return false;
    }

    this.generationService.restore(snapshot.generation);
    this.trainerService.restore(snapshot.trainer, snapshot.generation);
    this.gameStateService.restore(snapshot.game);
    this.extras = { ...(snapshot.extras ?? {}) };
    return true;
  }

  clear(): void {
    this.extras = {};
    localStorage.removeItem(GameSaveService.STORAGE_KEY);
  }
}
