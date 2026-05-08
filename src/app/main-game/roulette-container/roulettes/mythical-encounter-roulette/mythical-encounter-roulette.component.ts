import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { PokemonService } from '../../../../services/pokemon-service/pokemon.service';
import { PokemonItem } from '../../../../interfaces/pokemon-item';
import { mythicalPokemonIds } from './mythical-pokemon';

@Component({
  selector: 'app-mythical-encounter-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './mythical-encounter-roulette.component.html',
  styleUrl: './mythical-encounter-roulette.component.css'
})
export class MythicalEncounterRouletteComponent implements OnInit {

  constructor(private pokemonService: PokemonService) {}

  // Mythicals never get a chance to appear during the main story (gym → champion),
  // so the postgame is their dedicated stage. The pool is cross-generation.
  mythicals: PokemonItem[] = [];

  @Output() selectedPokemonEvent = new EventEmitter<PokemonItem>();

  ngOnInit(): void {
    this.mythicals = this.pokemonService.getPokemonByIdArray(mythicalPokemonIds);
  }

  onItemSelected(index: number): void {
    this.selectedPokemonEvent.emit(this.mythicals[index]);
  }
}
