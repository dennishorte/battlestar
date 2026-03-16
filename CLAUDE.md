# Battlestar - Board Game Platform

A web-based board game platform built as a monorepo (npm workspaces) with an Express.js API, Vue 3 frontend, and shared game logic library.

## Project Layout

```
api/        Express.js backend (MongoDB, Passport JWT auth, Vitest)
app/        Vue 3 + Vuex + Vue Router frontend (Vite, Bootstrap Vue Next)
common/     Shared game logic library (battlestar-common)
scripts/    Deployment and utility scripts
docs/       Detailed architecture documentation (see below)
```

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for the full directory tree.

## Supported Games

| Game | Common Module | Description |
|------|---------------|-------------|
| **Agricola** | `common/agricola/` | Farm-building worker placement (~1,790 files) |
| **Magic: The Gathering** | `common/magic/` | Card game with drafting (~30 files) |
| **Tyrants of the Underdark** | `common/tyrants/` | Hex-based tactical strategy (~33 files) |
| **Innovation: Ultimate** | `common/ultimate/` | Civilization card game (~1,380 files) |

## Key Commands

```bash
# Development
npm run dev    # (in api/) Start API server with hot reload
npm run dev    # (in app/) Start Vite dev server

# Testing
npm run test -w api       # API tests (Vitest)
npm run test -w common    # Game logic tests (Jest)

# Linting
npm run lint -w api
npm run lint -w common
```

## Architecture Documentation

| Document | Description |
|----------|-------------|
| [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | Full directory layout |
| [docs/api.md](docs/api.md) | API server architecture |
| [docs/app.md](docs/app.md) | Frontend architecture |
| [docs/common.md](docs/common.md) | Game framework (BaseGame, managers, zones, cards) |
| [docs/testing.md](docs/testing.md) | Testing setup and patterns |
| [docs/games/agricola.md](docs/games/agricola.md) | Agricola game implementation |
| [docs/games/magic.md](docs/games/magic.md) | Magic: The Gathering implementation |
| [docs/games/tyrants.md](docs/games/tyrants.md) | Tyrants of the Underdark implementation |
| [docs/games/ultimate.md](docs/games/ultimate.md) | Innovation: Ultimate implementation |

## Key Conventions

- **ES Modules** in api/ and app/; **CommonJS** in common/
- All games extend the base `Game` class from `common/lib/game.js`
- Game state is deterministic via seeded RNG (`seedrandom`)
- Games pause by throwing `InputRequestEvent`, end by throwing `GameOverEvent`
- API uses AsyncLock + branchId for concurrent access control
- Use `npm run test` (not `npx vitest`) to run tests
- MongoDB with Mongoose-free raw driver (`mongodb` package)

## Environment Setup

See the root [README.md](README.md) for MongoDB and `.env` configuration.
