# Frontend Architecture

## Overview

Vue 3 single-page application with Vuex state management, Vue Router, and Bootstrap Vue Next. Built with Vite.

## Entry Point (`src/main.js`)

Initializes Vue app with:
- Bootstrap Vue Next plugin
- Vue Router and Vuex store
- Auth utility (loads cached token from localStorage)
- Global properties: `$modal`, `$post` (HTTP client), `$device` (device detection)
- Global CSS: Bootstrap, Bootstrap Icons, Mana Font, custom styles

## Routing (`src/router/index.js`)

HTML5 history mode with module-based route composition:

| Path | Module | Component |
|------|--------|-----------|
| `/` | - | HomePage |
| `/login`, `/logout` | auth | SiteLogin |
| `/lobby/create`, `/lobby/:id` | lobby | GameLobby |
| `/game/:id` | games | GameBase (dynamic game loader) |
| `/game/editor/:id` | games | GameEditor |
| `/magic`, `/magic/card/:id`, etc. | magic | Card/Cube/Deck viewers |
| `/data/*` | data | Game data viewers |
| `/profile` | profile | UserProfile |
| `/admin` | admin | SiteAdmin |

**Route guard**: `authUtil.canAccess()` enforces login for all routes except `/login`.

## Vuex Store (`src/store/index.js`)

### `auth` module
- State: `user` (cached in localStorage), `status`, `impersonation`
- Actions: `login`, `logout`, `startImpersonation`, `stopImpersonation`

### `game` module (`modules/games/common/store.js`)
- State: `game`, `gameReady`, `loadError`, `saving`, `saveQueued`
- Key actions:
  - `load({ gameId, actor })` - Fetch from API, deserialize via `fromData()`, run game
  - `save()` - Serialize and save full state
  - `submitAction(action)` - Process player action, reload if state diverges
  - `_acquireLock()` / `_releaseLock()` - Serialized save operations

### `magic` module
- Sub-modules: `cards`, `cube`, `game`
- Manages mouseover card preview position

## GameBase Component (`src/components/GameBase.vue`)

Central game container that:
1. Loads game via Vuex `game/load`
2. Provides context to children via Vue 3 `provide()`: `actor`, `bus` (mitt event bus), `game`
3. Routes to game-specific component based on `game.settings.game`:
   - `AgricolaGame`, `MtgGame`, `TyrantsGame`, `UltimateGame`, `CubeDraft`
4. Displays loading state, error banner, pause notification

## HTTP Client (`src/util/axiosWrapper.js`)

- Wraps Axios POST requests
- Injects `appVersion` into every request body
- Handles `game_overwrite` (concurrent edit → reload modal) and `version_mismatch` (409 → reload)
- Available globally as `this.$post`

## Module Structure

Each module follows:
```
modules/{name}/
├── router.js        Route definitions
├── store.js         Vuex store module (if needed)
├── util.js          Module utilities
├── components/      Vue components
└── composables/     Vue 3 composables
```

## Game-Specific Modules (`modules/games/`)

### `common/` - Shared Game Components
- **OptionSelector.vue** - Recursive UI for game choice prompts
- **WaitingPanel.vue** - "Waiting for other players"
- **GameLog.vue** + log subcomponents - Game history display
- **ChatInput.vue** - In-game chat
- **SavingOverlay.vue** - Save progress indicator
- **GameEditor.vue** - Dev tool for editing game state

### Per-game modules
- **agricola/** - 24 components: board, farmyard, animal placement, cards, score
- **magic/** - 22 components: zones, counters, phases, tableau
- **tyrants/** - 21 components: hex map (HexTile, HexLocation, HexMap), market, tableau
- **ultimate/** - 24 components: card display variants, achievements, scoring
- **cube_draft/** - 7 components: draft UI, card selection

## Key Patterns

1. **Provide/Inject**: GameBase provides `actor`, `bus`, `game` to all child components
2. **Event Bus (Mitt)**: Cross-component communication within a game
3. **Concurrent Play**: Client reloads from server if state diverges after action
4. **Auto-imported Components**: Bootstrap Vue components via unplugin-vue-components

## Dependencies

- **vue** 3.5, **vue-router** 4.5, **vuex** 4.1
- **vite** 6.3, **bootstrap** 5.3, **bootstrap-vue-next** 0.29
- **axios** 1.9, **mitt** 3.0 (event bus)
- **battlestar-common** (shared game logic)
