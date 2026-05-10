import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PokemonItem } from '../../../../interfaces/pokemon-item';
import { PokemonService } from '../../../../services/pokemon-service/pokemon.service';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { ultraBeastPokemonIds } from './ultra-beast-pokemon';

@Component({
  selector: 'app-ultra-beast-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './ultra-beast-roulette.component.html',
  styleUrl: './ultra-beast-roulette.component.css',
})
export class UltraBeastRouletteComponent {

  constructor(private pokemonService: PokemonService) {
    this.ultraBeasts = this.pokemonService.getPokemonByIdArray(ultraBeastPokemonIds);
  }

  @Output() selectedPokemonEvent = new EventEmitter<PokemonItem>();

  ultraBeasts: PokemonItem[] = [];

  onItemSelected(index: number): void {
    const selectedPokemon = this.ultraBeasts[index];
    this.selectedPokemonEvent.emit(selectedPokemon);
  }
}
