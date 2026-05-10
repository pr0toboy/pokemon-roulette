import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import megaPrimalForms from '../trainer-service/pokemon-forms-mega-primal.json';
import { ItemItem } from '../../interfaces/item-item';
import { PokemonItem } from '../../interfaces/pokemon-item';
import { PokemonFormsService } from '../pokemon-forms-service/pokemon-forms.service';

export interface MegaForm {
  pokemonId: number;
  text: string;
  fillStyle: string;
  weight: number;
  /**
   * Item name that triggers this transformation. Defaults to 'mega-stone'.
   * Reserved for forms that require a specific item; currently every form
   * uses 'mega-stone', including Insurgence Megas, Mega Delta, Crystal Delta
   * Metagross, and Primal Giratina/Arceus/Regigigas.
   */
  itemRequired?: string;
}

@Injectable({
  providedIn: 'root' })
export class MegaEvolutionService {

  private readonly megaFormsByBaseId: Record<number, MegaForm[]> = megaPrimalForms as Record<number, MegaForm[]>;
  private readonly megaPokemonIds: Set<number>;

  private megaStoneTriggerSubject = new Subject<ItemItem>();

  constructor(private pokemonFormsService: PokemonFormsService) {
    this.megaPokemonIds = new Set(
      Object.values(this.megaFormsByBaseId).flat().map(form => form.pokemonId)
    );
  }

  get megaStoneTrigger$() {
    return this.megaStoneTriggerSubject.asObservable();
  }

  triggerMegaEvolution(megaStone: ItemItem): void {
    this.megaStoneTriggerSubject.next(megaStone);
  }

  // Returns the mega/primal forms available for the given Pokémon, resolving
  // alt forms (e.g. regional variants) back to their base species first.
  // If `itemName` is provided, filters to forms triggered by that specific item.
  getMegaForms(pokemon: PokemonItem, itemName: string = 'mega-stone'): MegaForm[] {
    const baseId = this.pokemonFormsService.getBasePokemonId(pokemon.pokemonId) ?? pokemon.pokemonId;
    const allForms = this.megaFormsByBaseId[baseId] ?? [];
    return allForms.filter(f => (f.itemRequired ?? 'mega-stone') === itemName);
  }

  canMegaEvolve(pokemon: PokemonItem, itemName: string = 'mega-stone'): boolean {
    return this.getMegaForms(pokemon, itemName).length > 0 && !this.isMegaForm(pokemon.pokemonId);
  }

  isMegaForm(pokemonId: number): boolean {
    return this.megaPokemonIds.has(pokemonId);
  }

  // Builds a new PokemonItem at the chosen mega form, preserving level/shininess
  // from the source Pokémon. Sprite is left null so the trainer service fetches
  // the correct mega artwork on the next sync.
  applyMegaForm(source: PokemonItem, form: MegaForm): PokemonItem {
    return {
      ...structuredClone(source),
      pokemonId: form.pokemonId,
      text: form.text,
      fillStyle: form.fillStyle,
      sprite: null
    };
  }
}
