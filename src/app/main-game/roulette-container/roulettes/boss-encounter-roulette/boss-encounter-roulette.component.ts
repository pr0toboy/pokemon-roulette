import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { WheelComponent } from '../../../../wheel/wheel.component';
import { GenerationService } from '../../../../services/generation-service/generation.service';
import { PokemonService } from '../../../../services/pokemon-service/pokemon.service';
import { GenerationItem } from '../../../../interfaces/generation-item';
import { PokemonItem } from '../../../../interfaces/pokemon-item';
import { bossByGeneration } from './bosses-by-generation';

@Component({
  selector: 'app-boss-encounter-roulette',
  imports: [WheelComponent, TranslatePipe],
  templateUrl: './boss-encounter-roulette.component.html',
  styleUrl: './boss-encounter-roulette.component.css'
})
export class BossEncounterRouletteComponent implements OnInit, OnDestroy {

  constructor(private generationService: GenerationService, private pokemonService: PokemonService) {}

  generation!: GenerationItem;
  bosses: PokemonItem[] = [];

  @Output() selectedPokemonEvent = new EventEmitter<PokemonItem>();

  private generationSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.generationSubscription = this.generationService.getGeneration().subscribe(gen => {
      this.generation = gen;
      const bossIds = bossByGeneration[this.generation.id] ?? [];
      this.bosses = this.pokemonService.getPokemonByIdArray(bossIds);
    });
  }

  ngOnDestroy(): void {
    this.generationSubscription?.unsubscribe();
  }

  onItemSelected(index: number): void {
    this.selectedPokemonEvent.emit(this.bosses[index]);
  }
}
