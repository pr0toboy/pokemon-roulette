import { WheelItem } from "./wheel-item";
import { PokemonType } from './pokemon-type';

export interface PokemonItem extends WheelItem {
  pokemonId: number;
  type1?: PokemonType;
  type2?: PokemonType | null;
  sprite: {
    front_default: string;
    front_shiny: string;
  } | null;
  shiny: boolean;
  power: 1 | 2 | 3 | 4 | 5;
  /**
   * Per-instance training level. Optional in source data because seed Pokédex
   * entries don't define it — it is assigned when the Pokémon is added to the
   * team (see TrainerService.addToTeam) and grows with battle victories.
   */
  level?: number;
}