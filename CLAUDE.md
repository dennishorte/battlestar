# Battlestar - Board Game Platform

Web-based board game platform. Monorepo with npm workspaces.

## Workspaces

| Workspace | Stack | Module System | Test Framework |
|-----------|-------|---------------|----------------|
| `common/` | Game logic library (battlestar-common) | CommonJS | Jest 27 |
| `api/` | Express.js 5, MongoDB (raw driver), Passport JWT | ES Modules | Vitest 3 |
| `app/` | Vue 3, Vuex, Vue Router, Vite, Bootstrap Vue Next | ES Modules | Jest 29 |

## Games

| Game | Path | Size | Notes |
|------|------|------|-------|
| Agricola | `common/agricola/` | ~1,790 files | Farm-building worker placement |
| Innovation: Ultimate | `common/ultimate/` | ~1,380 files | Civilization card game |
| Twilight Imperium | `common/twilight/` | ~600+ files | Space strategy, 26 factions |
| Magic: The Gathering | `common/magic/` | ~30 files | Card game with drafting |
| Tyrants of the Underdark | `common/tyrants/` | ~33 files | Hex-based tactical strategy |
| Warhammer | `common/warhammer/` | stub | Not yet implemented |

**Before modifying a game**, read `docs/games/<game>.md` for that game's architecture and conventions.

## Commands

```bash
# Testing (ALWAYS use npm run test, never npx vitest)
npm run test -w common                                    # All game logic tests
npm run test -w common -- --testPathPattern agricola      # Single game
npm run test -w common -- --testPathPattern "path/to/test" # Single file
npm run test -w api                                       # API tests

# Dev servers
npm run dev    # in api/ — Express on port 3000
npm run dev    # in app/ — Vite dev server

# Linting
npm run lint -w api
npm run lint -w common
```

## Core Architecture

### Game Engine (`common/lib/`)

All games extend `Game` from `common/lib/game.js`. Key execution model:

- **Deterministic replay**: Seeded RNG (`seedrandom`). On each `run()`, entire game replays from start using stored `responses[]`.
- **Flow control via exceptions**: Games pause by throwing `InputRequestEvent`, end by throwing `GameOverEvent`.
- **State is ephemeral**: `game.state` resets on every `run()`. Only `responses[]` and `settings` persist.

Manager classes (all in `common/lib/game/`):
- `BaseActionManager` — player choice interface (choose, chooseCard, choosePlayer, etc.)
- `BasePlayer` / `BasePlayerManager` — player state, counters, turn order
- `BaseZone` / `BaseZoneManager` — card containers with visibility (public/private/hidden)
- `BaseCard` / `BaseCardManager` — cards with movement and visibility tracking
- `BaseLogManager` — game log with templates and arg handlers
- `GameProxy` — transparent property delegation so managers access game state directly

### Game Structure Pattern

Each game in `common/<game>/` follows this layout:
- `<game>.js` — main game class extending `Game`
- `res/` — card/action definitions (data files)
- `tests/` or `*.test.js` — test files
- `testutil.js` — game-specific test helpers extending `common/lib/test_common.js`

### API (`api/`)

Request flow: `auth → bodyParser → ensureVersion → coerceMongoIds → loaders (AsyncLock) → router → controller → service → model → DB`

- AsyncLock + branchId for concurrent access control
- MongoDB with raw driver (no Mongoose)
- See `docs/api.md` for full details

### Frontend (`app/`)

- Game components in `app/src/modules/games/<game>/`
- Shared game UI in `app/src/modules/games/common/`
- Game state managed via Vuex store (`app/src/modules/games/common/store.js`)
- See `docs/app.md` for full details

## Testing Conventions

- **Integration tests only** for game logic — never call internal game methods, never mock game internals
- Test pattern: `fixture()` → `setBoard()` → `game.run()` → `choose()`/`action()` → `testBoard()`
- State after `game.run()` is lost on next choose/action — use `setBoard()` for setup
- Player refs go stale — re-fetch via `game.players.byName('name')` after any action
- See `docs/testing.md` for full test infrastructure details

## Documentation Index

| Document | When to read |
|----------|-------------|
| `docs/common.md` | Modifying game framework or understanding base classes |
| `docs/api.md` | Working on API routes, controllers, middleware |
| `docs/app.md` | Working on frontend components |
| `docs/testing.md` | Writing or debugging tests |
| `docs/games/agricola.md` | Modifying Agricola |
| `docs/games/ultimate.md` | Modifying Innovation: Ultimate |
| `docs/games/magic.md` | Modifying Magic: The Gathering |
| `docs/games/tyrants.md` | Modifying Tyrants of the Underdark |
| `docs/PROJECT_STRUCTURE.md` | Full directory tree reference |
