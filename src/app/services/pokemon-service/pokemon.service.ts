import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { PokemonItem } from '../../interfaces/pokemon-item';
import { nationalDexPokemon } from './national-dex-pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private readonly pokemonById: Map<number, PokemonItem>;

  constructor(private http: HttpClient) {
    this.pokemonById = new Map(
      this.nationalDexPokemon.map(pokemon => [pokemon.pokemonId, pokemon])
    );
  }

  private apiBaseUrl = 'https://pokeapi.co/api/v2';
  readonly nationalDexPokemon = nationalDexPokemon;

  /**
   * Fetches the sprites for a given Pokémon by ID.
   * @param pokemonId The ID of the Pokémon.
   * @returns An Observable of the sprite URLs.
   */
  getPokemonSprites(pokemonId: number): Observable<{ sprite: { front_default: string; front_shiny: string; }; }> {
    const url = `${this.apiBaseUrl}/pokemon/${pokemonId}`;
    return this.http.get<any>(url).pipe(
      retry({
        count: 3,    // Retry up to 3 times
        delay: 1000  // Wait 1 second between retries
      }),
      map((response) => ({
        sprite: response.sprites.other['official-artwork']
      })),
      catchError((error) => {
        console.error(`Failed to fetch Pokémon ${pokemonId}:`, error);
        return throwError(() => new Error('Failed to fetch Pokémon data'));
      })
    );
  }

  getPokemonById(pokemonId: number): PokemonItem | undefined {
    return this.pokemonById.get(pokemonId);
  }

  getPokemonByIdArray(pokemonIds: number[]): PokemonItem[] {
    return pokemonIds
      .map(pokemonId => this.pokemonById.get(pokemonId))
      .filter((pokemon): pokemon is PokemonItem => pokemon !== undefined);
  }

  getAllPokemon(): PokemonItem[] {
    return this.nationalDexPokemon;
  }

  /**
   * Returns the dex slice appropriate for a generation's roulettes (trade,
   * mysterious egg, etc.). Insurgence-only entries (Deltas, Primals, Insurgence
   * Megas — all IDs ≥ 30000) are filtered out unless the run is the
   * Insurgence (Gen 100) campaign.
   */
  getDexForGeneration(generationId: number): PokemonItem[] {
    if (generationId === 100) {
      return this.nationalDexPokemon;
    }
    return this.nationalDexPokemon.filter(p => p.pokemonId < 30000);
  }
}