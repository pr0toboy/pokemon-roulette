import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { PokemonService } from '../../../../services/pokemon-service/pokemon.service';
import { GenerationService } from '../../../../services/generation-service/generation.service';
import { PokemonItem } from '../../../../interfaces/pokemon-item';

@Component({
  selector: 'app-trade-pokemon-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './trade-pokemon-roulette.component.html',
  styleUrl: './trade-pokemon-roulette.component.css'
})
export class TradePokemonRouletteComponent implements OnInit, OnDestroy {

  constructor(
    private pokemonService: PokemonService,
    private generationService: GenerationService,
  ) {}

  nationalDexPokemon: PokemonItem[] = [];
  private generationSubscription: Subscription | null = null;

  @Output() selectedPokemonEvent = new EventEmitter<PokemonItem>();

  ngOnInit(): void {
    this.generationSubscription = this.generationService.getGeneration().subscribe(gen => {
      this.nationalDexPokemon = this.pokemonService.getDexForGeneration(gen.id);
    });
  }

  ngOnDestroy(): void {
    this.generationSubscription?.unsubscribe();
  }

  onItemSelected(index: number): void {
    const selectedPokemon = this.nationalDexPokemon[index];
    this.selectedPokemonEvent.emit(selectedPokemon);
  }
}
