# Game Engine Overview

This document describes the core architecture of the game-center engine, covering deterministic replay, exception-driven input, state management, and the key abstractions that all games share.

## Architecture Summary

The engine is built around three core principles:

1. **Deterministic replay** -- The entire game state is reconstructed from scratch by replaying stored responses through the game logic. There is no persisted game state; only the list of player responses is saved.
2. **Exception-driven input** -- When the game needs player input, it throws an `InputRequestEvent`. When the game ends, it throws a `GameOverEvent`. Normal control flow never returns from `_mainProgram()`.
3. **Proxy-based access** -- Any object that sets `this.game` (players, cards, zones, managers) gets transparent access to `this.log`, `this.actions`, `this.cards`, `this.players`, `this.zones`, and `this.state` via the GameProxy pattern.

---

## The Game Class

### Constructor

```javascript
function Game(serialized_data, viewerName, opts = {})
```

**Parameters:**
- `serialized_data` -- Persisted game data containing `_id`, `settings`, `responses`, `branchId`, and `chat`
- `viewerName` -- Name of the player viewing the game (used for visibility filtering)
- `opts` -- Manager class overrides:

```javascript
{
  LogManager: BaseLogManager,
  ActionManager: BaseActionManager,
  CardManager: BaseCardManager,
  PlayerManager: BasePlayerManager,
  ZoneManager: BaseZoneManager,
}
```

The constructor initializes all managers and seeds the random number generator from `settings.seed`.

### Key Properties

| Property | Description |
|----------|-------------|
| `this.state` | Mutable state object, reset on every `run()` call |
| `this.settings` | Immutable game configuration (players, seed, game-specific options) |
| `this.responses` | Ordered list of all player responses -- never reset |
| `this.waiting` | Reference to the current `InputRequestEvent`, if any |
| `this.random` | Seeded RNG function (see Deterministic Randomness below) |
| `this.breakpoints` | Test hook insertion points |

---

## The Run Cycle

### `run()`

Every time the game needs to advance, `run()` is called. It resets all state and replays the game from the beginning:

```
run()
  -> _reset()         // Clear state, re-seed RNG, reset managers
  -> _mainProgram()   // Execute the entire game from the start
     -> replays stored responses automatically
     -> throws InputRequestEvent when it needs new input
     -> throws GameOverEvent when the game ends
```

### `_reset()`

Called at the start of every `run()`. Resets:
- `this.state` to a blank state (`{ indent: 0, responseIndex: -1 }`)
- `this.random` to a fresh seeded RNG
- All managers (log, players, cards, zones)

Subclasses override `_reset()` to add game-specific state, always calling the parent first.

### `_mainProgram()`

Abstract method. Every game must implement this. It contains the full game logic as a linear program:

```javascript
Agricola.prototype._mainProgram = function() {
  this.initialize()
  if (this.settings.useDrafting) {
    this.draftPhase()
  }
  this.mainLoop()
}
```

The key insight: `_mainProgram()` never returns normally. It either throws `InputRequestEvent` (game needs input) or `GameOverEvent` (game is over).

---

## Response Storage and Replay

Responses are stored as an ordered array in `this.responses`. Each time `run()` is called:

1. `_reset()` sets `state.responseIndex` to `-1`
2. As `_mainProgram()` executes, each call to `requestInputSingle` / `requestInputMany` / `requestInputAny` increments `state.responseIndex` and checks if a stored response exists at that index
3. If a stored response exists, it is returned immediately (replay)
4. If no stored response exists, an `InputRequestEvent` is thrown

When a player submits a response:

```javascript
game.respondToInputRequest(response)
  -> pushes response onto this.responses
  -> calls this.run() to replay from the beginning with the new response included
```

This means the full game logic runs from scratch on every player action. The deterministic design ensures identical results each time.

---

## InputRequestEvent and GameOverEvent

### InputRequestEvent

```javascript
function InputRequestEvent(selectors, opts = {}) {
  this.selectors = selectors        // Array of selector objects
  this.concurrent = opts.concurrent // Whether responses are independent
}
```

Thrown when the game needs player input. The `selectors` array describes what input is needed from which players. See [input-request-system.md](./input-request-system.md) for full selector documentation.

### GameOverEvent

```javascript
function GameOverEvent(data) {
  this.data = data  // { player, reason }
}
```

Thrown when a player wins or the game ends. Caught by `run()`, which sets `this.gameOver = true` and stores the result data.

---

## The GameProxy Pattern

The `GameProxy` wraps every object that has a `this.game` reference (players, cards, zones, and all managers). It intercepts property access via a JavaScript `Proxy`:

```javascript
const PROXY_ITEMS = ['log', 'actions', 'cards', 'players', 'state', 'util', 'zones']

// When you access this.log on a player:
//   -> Proxy intercepts the get
//   -> Returns this.game.log instead
```

This means any code in a player, card, zone, or manager can directly use:
- `this.log.add(...)` instead of `this.game.log.add(...)`
- `this.players.current()` instead of `this.game.players.current()`
- `this.state.round` instead of `this.game.state.round`

Setting these proxied properties throws an error to prevent accidental overwrites.

---

## Deterministic Randomness

The engine uses `seedrandom` to provide deterministic random numbers:

```javascript
this.random = seedrandom(this.settings.seed)
```

Because `_reset()` re-seeds from the same seed every time, and the game replays the same sequence of calls, all random outcomes (shuffles, die rolls, coin flips) produce identical results on every replay. This is critical for the replay architecture.

All randomness must go through `this.random` (or helpers that use it, like `zone.shuffle()` and `util.array.shuffle()`). Using `Math.random()` would break determinism.

---

## Factory Pattern

`GameFactory` is the base factory that normalizes settings and creates a bare `Game` instance:

```javascript
function GameFactory(settings, viewerName) {
  // Ensures settings has: game, name, players, seed
  // Asserts players.length > 0, name.length > 0
  // Defaults seed to name if not provided
  return new Game({ responses: [], settings }, viewerName)
}
```

Game-specific factories extend this pattern:

```javascript
function AgricolaFactory(settings, viewerName) {
  const data = GameFactory(settings)
  data.settings.useDrafting = settings.useDrafting || false
  data.settings.cardSets = settings.cardSets || res.getCardSetIds()
  return new Agricola(data, viewerName)
}
```

---

## Breakpoint System

Breakpoints allow test code to inject callbacks at named points in the game logic:

```javascript
// In test code:
game.testSetBreakpoint('initialization-complete', (game) => {
  // Modify game state after initialization but before main loop
})

// In game code:
this._breakpoint('initialization-complete')
// All registered callbacks for this name are called in order
```

Multiple callbacks can be registered for the same breakpoint name. This is used for:
- Setting up card state that requires the game to be partially initialized
- Inspecting intermediate game state during tests
- Injecting behavior that the `setBoard` test helper cannot express

---

## Undo

The `undo()` method pops user responses from the end of `this.responses` and replays:

1. Walks backward through responses, skipping non-user responses
2. Stops at `noUndo` markers (irreversible actions like randomized events)
3. Removes the last user response and calls `run()` to replay without it

Returns `'__SUCCESS__'`, `'__NO_UNDO__'`, or `'__NO_MORE_ACTIONS__'`.

---

## Inheritance Pattern

Games use prototypal inheritance via `util.inherit`:

```javascript
function Agricola(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName, {
    PlayerManager: AgricolaPlayerManager,
    ActionManager: AgricolaActionManager,
    // ...
  })
}

util.inherit(Game, Agricola)

Agricola.prototype._mainProgram = function() { ... }
```

The manager overrides passed to the `Game` constructor allow each game to provide specialized managers while reusing the base engine.
