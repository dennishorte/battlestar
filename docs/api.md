# API Architecture

## Overview

Express.js 5 backend with MongoDB, JWT authentication, and real-time game state management. Uses ES modules throughout.

## Request Flow

```
Request → auth.authenticate → bodyParser → ensureVersion → coerceMongoIds
  → Data Loaders (loadGameArgs, etc.) → Router → Controller → Service → Model → DB
  → Response → errorHandler
```

## Entry Point (`server.js`)

- Express app on port 3000
- Serves `../app/dist` for production SPA
- History API fallback for client-side routing
- Swagger docs in dev mode
- Exports `app` and `startServer()` for testing

## Middleware (`src/middleware/`)

### `auth.js` - Authentication
- Passport.js with JWT strategy (Bearer token from Authorization header)
- Validates against `SECRET_KEY` env var
- Loads user from DB, updates `lastSeen` timestamp
- **Exempt routes**: `/api/guest/*` and non-admin GET requests

### `loaders.js` - Resource Loading
- Loads DB resources into `req[itemType]` based on `{itemType}Id` in request body
- **AsyncLock** serializes load-process-save cycles per resource (30-second timeout)
- Lock held until HTTP response completes (`res.locals.unlock`)
- Converts MongoDB data to game objects via `fromData()` from battlestar-common
- Item types: card, cube, deck, draft, game, lobby

### `validators.js` - Validation
- `coerceMongoIds`: Recursively converts 24-char hex strings to ObjectId (preserves UUIDs)
- `ensureVersion`: Returns 409 if `appVersion` mismatches
- `validate(schema)`: Joi schema validation middleware

### `errors.js` - Error Handling
- Centralized error handler with custom error classes
- Stack traces in dev mode

## Routes (`src/routes/api/`)

| Path | Router | Auth Required |
|------|--------|---------------|
| `/api/guest/*` | `authRouter` | No |
| `/api/game/*` | `gameRouter` | Yes |
| `/api/user/*` | `userRouter` | Yes |
| `/api/lobby/*` | `lobbyRouter` | Yes |
| `/api/tyrants/*` | `tyrantsRouter` | Yes |
| `/api/magic/*` | `magicRouter` | Yes |
| `/api/misc/*` | `miscRouter` | Yes |
| `/api/admin/*` | `adminRouter` | Admin only |

## Controllers (`src/controllers/`)

### `game_controller.js` - Game Endpoints
- **Lifecycle**: `create`, `fetch`, `fetchAll`, `kill`, `pause`, `unpause`, `rematch`
- **State**: `saveFull` (conflict detection via branchId), `saveResponse`, `undo`
- **Player data**: `saveNotes`, `fetchNotes`, `saveCardOrder`, `fetchCardOrder`
- **Stats**: `stats_innovation`, `stats_agricola`
- Handles `GameOverwriteError` and `GameKilledError` as 409 Conflict

### `lobby_controller.js` - Lobby Management
### `user_controller.js` - Authentication & Profiles
### Magic controllers - Card, cube, deck, scryfall, link management

## Models (`src/models/`)

### `game_models.js` - Game Collection
- **Queries**: `findById`, `findByUserId`, `findWaitingByUserId`, `getActiveSummary`
- **Persistence**: `save` (with branchId tracking), `gameOver`, `pause/unpause`
- **Player data**: `saveNotes/getNotes`, `saveCardOrder/getCardOrder`
- Uses `battlestar-common` for game object conversion

### Other models
- `user_models.js` - Users, auth tokens
- `lobby_models.js` - Game lobbies
- `notif_models.js` - Notifications

## Services (`src/services/`)

### `game_service.js`
- `create(lobby)` - Creates game from lobby, handles draft/Magic linking, sends notifications
- `saveFull(game, metadata)` - Saves with branchId conflict detection, pause/killed validation
- `saveResponse(game, response)` - Processes player response via game logic
- `undo(game, count)` - Undoes actions
- `_testAndSave()` - Shared save logic: validates, handles GameOverEvent, saves, notifies

### `notification_service.js` - Slack/Telegram notifications

## Key Patterns

1. **Conflict Detection**: `branchId` increments on each save; concurrent saves return 409
2. **Concurrent Drafting**: Special case where branchId check is skipped (multiple players submit simultaneously)
3. **Resource Locking**: AsyncLock prevents race conditions on game state
4. **Game Object Lifecycle**: MongoDB data → `fromData()` → Game object → `serialize()` → MongoDB
5. **Response Format**: Controllers return `{ status: 'success', ...data }` or `{ status: 'error', message }`

## Dependencies

- **express** 5.1 - Web framework
- **mongodb** 6.16 - Database driver (no Mongoose)
- **passport** + **passport-jwt** - JWT authentication
- **joi** 17.13 - Schema validation
- **bcrypt** 6.0 - Password hashing
- **async-lock** 1.4 - Concurrency control
- **battlestar-common** - Shared game logic
- **@slack/web-api** - Slack notifications
