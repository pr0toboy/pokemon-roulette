# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server on `0.0.0.0:4200` (the `start` script wraps `ng serve` with the host/port flags; `ng serve` alone binds to localhost only).
- `npm run build` — production build to `dist/pokemon-roulette/`. Bundle budgets: 1 MB warn / 2 MB error initial; 4 kB / 8 kB per-component style.
- `npm run watch` — incremental dev build.
- `npm test` — runs Karma. The default launcher is `ChromeHeadlessNoSandbox` (see `karma.conf.js`), which is required on Raspberry Pi / Docker / sandboxed envs. CI uses plain `ChromeHeadless` and passes `--browsers=ChromeHeadless --watch=false`.
- Single spec: `npm test -- --include='src/app/services/game-state-service/game-state.service.spec.ts' --watch=false`.
- `npm run deploy` — `angular-cli-ghpages` deploy with `--base-href=/pokemon-roulette/` (force-pushes the build to the `gh-pages` branch). The site is hosted by GitHub at `https://<owner>.github.io/pokemon-roulette/` — no Pi/server is involved at runtime, GitHub serves static files only.

## Deployment

GitHub Pages must be **enabled once** in the repo settings before `npm run deploy` produces a live site. The branch `gh-pages` is the deploy target but its existence alone isn't enough — Pages has to be turned on for that branch. To enable from the CLI (token needs `repo` scope, which `gh auth login` provides by default):

```bash
gh api -X POST /repos/<owner>/pokemon-roulette/pages \
  -f 'source[branch]=gh-pages' -f 'source[path]=/'
```

Once enabled, the URL becomes `https://<owner>.github.io/pokemon-roulette/` and propagates within ~1 minute of each `npm run deploy`. There are no runtime dependencies — the app talks directly to `pokeapi.co` from the visitor's browser, and all persistence is in `localStorage`.

## Architecture

### Game flow is a state stack

`src/app/services/game-state-service/game-state.service.ts` is the spine of the game. At construction it pushes the **entire run, in reverse order**, onto `stateStack: GameState[]` (e.g. `game-finish` → `champion-battle` → 4× `elite-four-battle` → 8× `gym-battle` interleaved with `adventure-continues` → `start-adventure` → `starter-pokemon` → `character-select`). `finishCurrentState()` pops the top and emits it on the `currentState` observable; any roulette can call `setNextState(...)` to splice a sub-flow onto the stack (e.g. `evolve-pokemon`, `select-form`, `check-shininess`). The stack is the source of truth — there is no FSM/transition table.

Gym and Elite Four counts come from `GENERATION_GAME_CONFIG`, keyed by generation id. Insurgence is gen `100`.

### Roulettes are one component per state

`MainGameComponent` hosts `RouletteContainerComponent` (`src/app/main-game/roulette-container/`), which subscribes to `currentState` and renders the matching roulette from `roulette-container/roulettes/<state>-roulette/`. Adding a new state means:

1. Extend the `GameState` union in `services/game-state-service/game-state.ts`.
2. Push it onto the stack (either in `initializeStates`, or dynamically via `setNextState` from another roulette).
3. Create `<state>-roulette/` and import it in `roulette-container.component.ts`'s `imports` array and template `@switch`.

`EventSource.ts` (in `main-game/`) is a *separate* narrower union for event-triggered encounters — don't confuse it with `GameState`.

### Persistence is automatic

`GameSaveService` autosaves a versioned `GameSnapshot` (`{ version, savedAt, generation, trainer, game, extras }`) to `localStorage` (`pokemon-roulette-run-v1`) on every `currentState` change, **except** for the transient states in `TRANSIENT_STATES` (`select-form`, `select-from-pokemon-list`, `select-evolution`, `check-shininess`) — reloading inside one of those falls back to the last stable state. Bump `SAVE_SCHEMA_VERSION` on incompatible shape changes. `RouletteContainerComponent` owns the free-form `extras` bag (e.g. `towerFloor`).

### Modals are serialized

Always go through `ModalQueueService.open()` instead of `NgbModal.open()` directly — it chains modal openings on a promise queue so a second `.open()` waits for the first to dismiss, preventing stacked Bootstrap modals.

### Pokémon and generation data

`PokemonService` builds a `Map<id, PokemonItem>` from `national-dex-pokemon.ts` at construction and exposes lookups; sprites are fetched lazily from `https://pokeapi.co/api/v2` with `retry({ count: 3, delay: 1000 })`. `getDexForGeneration(genId)` returns the **regional** pool (so a Gen 4 run can't trade for a Gen 9 species). Gen 100 (Insurgence/Torren) is a special pool — gens 1-6 + the Insurgence dex.

`GenerationService` is the single source of truth for the generation list (id, region, wheel color, weight). Per-generation content lives in side-files: `pokedex/pokedex-by-generation.ts`, `roulettes/boss-encounter-roulette/bosses-by-generation.ts`, etc. **Adding a generation** means touching all of these *and* `GENERATION_GAME_CONFIG`.

### Internationalization

Six locales (`en`, `es`, `fr`, `de`, `it`, `pt`) live in `src/assets/i18n/*.json`, loaded via `@ngx-translate/http-loader`. Any new UI string needs a key in **all six** files; `en` is the default fallback. Active language is persisted in `localStorage` under `language`.

### Theming

`ThemeService` is eagerly instantiated in `AppComponent`'s constructor specifically so the saved theme is applied **before** any settings panel opens — don't lazily inject it elsewhere in a way that defers that side effect.

## Conventions

- Standalone components only (no NgModules). New components must declare `standalone: true` and import their own dependencies.
- Selectors use the `app` prefix (configured in `angular.json`).
- The `dark-background.png`, sound effects, and other static assets are served from `public/` (mapped to web root), while `src/assets/` holds bundled translations and generation-specific sprites.

## Fork-specific notes

- The `/coffee` donation page is **intentionally not in `app.routes.ts`** on this fork. The upstream `CoffeeComponent` hardcodes the original author's Pix code (name + phone embedded in the payload). The component file is kept so the route can be restored in one line once a fork-owned donation target (Pix, PayPal, Ko-fi, …) replaces the upstream payload in `src/app/coffee/coffee.component.ts`. Don't add the import back until that swap is done — deploying as-is would solicit donations on behalf of someone else.
