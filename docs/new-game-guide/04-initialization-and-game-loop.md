# 4. Initialization and Game Loop

The game engine uses deterministic replay: on every player action, the entire game replays from scratch using stored responses. This section covers how to structure `_mainProgram()`, initialization, and the main loop within that constraint.

---

## _mainProgram()

Every game must implement `_mainProgram()` on its prototype. This is the single entry point for all game logic -- it runs from the very beginning every time `game.run()` is called.

```javascript
MyGame.prototype._mainProgram = function() {
  this.initialize()
  this.mainLoop()
}
```

Some games add optional phases before the main loop:

```javascript
MyGame.prototype._mainProgram = function() {
  this.initialize()
  if (this.settings.useDrafting) {
    this.draftPhase()
  }
  this.mainLoop()
}
```

`_mainProgram()` never returns normally. It either:
- Throws `InputRequestEvent` (game needs player input -- this is how the game "pauses")
- Throws `GameOverEvent` (game is over)

---

## _reset() and _blankState()

`_reset()` is called at the start of every `run()`. It clears all state and re-seeds the RNG. Override it to add game-specific state:

```javascript
MyGame.prototype._reset = function() {
  Game.prototype._reset.call(this)

  // Game-specific state (rebuilt from scratch on every replay)
  this.state.round = 0
  this.state.phase = null
  this.state.activePlayerIndex = 0
  this.state.passedPlayers = []
}
```

**Critical rule**: Everything in `this.state` is ephemeral. It's blown away on every `run()`. Only `this.responses` and `this.settings` persist across replays. If you set state after `game.run()` in a test, it will be lost on the next `t.choose()` call.

---

## Initialization Sequence

The `initialize()` method sets up the game world before the main loop begins. Follow this general order:

```javascript
MyGame.prototype.initialize = function() {
  // 1. Create player zones (hands, boards, discard piles, etc.)
  this.initializeZones()

  // 2. Create and register cards
  this.initializeCards()

  // 3. Set up the board/map if applicable
  this.initializeBoard()

  // 4. Deal starting hands, place starting units, etc.
  this.initializeStartingState()

  // 5. Fire the breakpoint for test setup
  this._breakpoint('initialization-complete')
}
```

### The initialization-complete Breakpoint

This breakpoint is essential for testing. `t.setBoard()` registers a callback here to inject test state after initialization but before the main loop:

```javascript
// In testutil.js
TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('initialization-complete', (game) => {
    // Apply test state to the initialized game
    if (state.dennis) applyPlayerState(game, 'dennis', state.dennis)
    if (state.micah) applyPlayerState(game, 'micah', state.micah)
    // ...
  })
}
```

Because the engine replays from scratch, this breakpoint fires on every replay, ensuring test state is consistently applied.

### Initialization Granularity

How many `initialize*()` methods you need depends on complexity:

| Game | Approach |
|------|----------|
| Magic | Minimal: `initializePlayers()`, `initializeZones()` |
| Agricola | Granular: `initializeStats()`, `initializePlayers()`, `initializeZones()`, `initializeActionSpaces()` |
| Tyrants | Very granular: 6+ initialize methods for expansions, map, cards, tokens, hands, transient state |

Start with a single `initialize()` and extract sub-methods when it grows past ~50 lines.

---

## Main Loop Patterns

The main loop structure depends on the game's turn model. Here are the four patterns used by existing games:

### Round-Based (Agricola)

Fixed number of rounds, each with multiple phases:

```javascript
MyGame.prototype.mainLoop = function() {
  for (let round = 1; round <= this.settings.totalRounds; round++) {
    this.state.round = round
    this.log.add({ template: '=== Round {round} ===', args: { round }, event: 'round-start' })

    this.replenishPhase()
    this.workPhase()        // Players place workers in turn order

    if (this.isHarvestRound(round)) {
      this.harvestPhase()   // Field, feeding, breeding
    }
  }
  this.endGame()
}
```

### Phase-Based (Twilight Imperium)

Rounds with distinct named phases, where each phase has different rules:

```javascript
MyGame.prototype.mainLoop = function() {
  while (true) {
    this.state.round++
    this.strategyPhase()    // Pick strategy cards
    this.actionPhase()      // Take turns until all pass
    this.statusPhase()      // Score objectives, refresh
    if (this.state.custodiansRemoved) {
      this.agendaPhase()    // Vote on political agendas
    }
  }
  // GameOverEvent thrown when a player hits 10 VP
}
```

### Turn-Based (Tyrants)

Simple turn rotation until an end condition:

```javascript
MyGame.prototype.mainLoop = function() {
  while (!this.isGameOver()) {
    for (const player of this.players.active()) {
      this.playerTurn(player)
    }
  }
  this.endGame()
}
```

### Draft-Then-Play (Magic)

A draft phase followed by a different game mode:

```javascript
MyGame.prototype._mainProgram = function() {
  this.initialize()
  this.draftPhase()         // Players draft cards (requestInputAny)
  this.deckBuildPhase()     // Players build decks (requestInputMany)
  this.playPhase()          // Play matches
}
```

---

## Phase Extraction

For games with distinct phases, extract each phase into its own file:

```
common/<game>/phases/
├── strategy.js       strategyPhase()
├── action.js         actionPhase(), playerTurn()
├── status.js         statusPhase()
└── harvest.js        harvestPhase(), feedingPhase()
```

Mix them into the game prototype:

```javascript
// In <game>.js
const strategyPhase = require('./phases/strategy')
const actionPhase = require('./phases/action')

Object.assign(MyGame.prototype, strategyPhase)
Object.assign(MyGame.prototype, actionPhase)
```

Or use explicit assignment:

```javascript
MyGame.prototype.strategyPhase = require('./phases/strategy').strategyPhase
```

---

## State That Survives Replay

| Persists | Ephemeral (rebuilt each run) |
|----------|-----------------------------|
| `this.responses` | `this.state.*` |
| `this.settings` | Player objects |
| | Card objects and zones |
| | Log entries |
| | RNG state |

Everything in the "ephemeral" column is reconstructed identically on each replay because the RNG seed and response sequence are the same. This is the core invariant of the engine. Never store meaningful state outside of `this.state` during a run, and never expect `this.state` to survive across runs.

---

## Player Choices

Use `BaseActionManager`'s choose helpers to request player input. Pick the right helper for what you're choosing:

| Helper | Use for |
|--------|---------|
| `choose(player, choices, opts)` | Plain strings, numbers, or fully custom structured choice objects. |
| `chooseCard(player, cards, opts)` / `chooseCards(player, cards, opts)` | Selecting from an array of card objects. Emits structured choices and resolves selections id-first. |
| `choosePlayer(player, players, opts)` | Selecting from a list of player objects. |
| `chooseYesNo(player, title)` | Binary choice. |

### Prefer `chooseCards` for card selection

`chooseCards` takes an array of card objects directly and returns the chosen card objects — no intermediate name-based lookup. Under the hood it emits structured choice objects that carry each card's `id`, `defId`, and an optional `opts.kind` tag, then resolves the response id-first. This means:

- Selections stay deterministic even when two cards in the choice pool share a title.
- Replay is stable across card renames (ids don't change).
- The frontend can resolve each option chip to the correct card definition without name guessing.

```javascript
// GOOD — returns card objects, id-matched
const [chosen] = this.actions.chooseCards(player, acquirableCards, {
  title: 'Acquire a card',
  kind: 'imperium-card',   // optional type tag used by the UI
})

// ANTI-PATTERN — name-based lookup breaks when names collide
const names = acquirableCards.map(c => c.name)
const [name] = this.actions.choose(player, names, { title: 'Acquire a card' })
const chosen = acquirableCards.find(c => c.name === name)  // silently picks first match
```

If your prompt needs both card options and a non-card "Pass" entry, mix a sentinel object into the card list:

```javascript
const PASS = { name: 'Pass', id: '__pass__' }
const [chosen] = this.actions.chooseCards(player, [PASS, ...acquirableCards], {
  title: 'Acquire cards',
  kind: 'imperium-card',
})
if (chosen.id === '__pass__') {
  return
}
```

### Structured choices for non-card data

When you need `choose` with custom options (e.g. board spaces, leaders, abilities) and a collision is possible, hand-roll the structured choice objects:

```javascript
const choices = [
  { title: 'Arrakeen',    id: 'arrakeen',    kind: 'board-space' },
  { title: 'Carthag',     id: 'carthag',     kind: 'board-space' },
  { title: 'Stillsuits',  id: 'stillsuits',  kind: 'imperium-card' },
]
const [selected] = this.actions.choose(player, choices, { title: 'Deploy agent' })
// `selected` is either a bare title string (when the choice had no id) or
// a `{title, id}` object. `chooseCards` wraps both cases; for raw `choose`,
// resolve by id when the choice objects carried one.
```

### Back-compat with plain strings

Plain string choices (`choose(player, ['yes', 'no'])`) remain fully supported. Don't introduce structured choices where they aren't needed — simple yes/no, faction pickers, and action menus with unique titles stay as plain strings. The validator and auto-responder treat both forms transparently.

See `docs/common.md` for the full protocol definition, and [Section 7](07-testing-strategy.md) for how `t.choose` consumes structured choices in tests.

---

## Player Color Selection

The base `Game` class provides `this.chooseColor(player)` which prompts a player to pick from the available colors (red, orange, yellow, lime, green, blue, indigo, pink). It's idempotent -- if a player already has a color, it returns immediately.

Call it before a player's first visible action so that log entries and UI elements have a color to display. Common patterns:

```javascript
// At the start of each player's first turn (Agricola)
MyGame.prototype.playerTurn = function(player) {
  this.chooseColor(player)
  // ...
}

// During a setup phase before the main loop (Twilight Imperium)
for (const player of this.players.all()) {
  this.chooseColor(player)
}
```

Don't call it during `initialize()` -- it triggers an input request, which means it needs to happen after the initialization-complete breakpoint so that `setBoard()` works correctly in tests. For test fixtures, you can skip color selection by pre-assigning colors in `setBoard()` or by setting `chooseColors: false` in settings (if your game supports that flag).

---

## End Game

When the game ends, throw `GameOverEvent`:

```javascript
const { GameOverEvent } = require('../../lib/game')

MyGame.prototype.endGame = function() {
  const scores = this.calculateScores()
  const winner = scores.reduce((a, b) => a.score > b.score ? a : b)

  throw new GameOverEvent({
    player: winner.player,
    reason: `${winner.player.name} wins with ${winner.score} points`,
  })
}
```

Some games check for victory conditions mid-turn (e.g., Twilight checks VP after each action). In that case, call a `checkVictory()` method at each potential trigger point.

---

## References

- **Run cycle and replay**: [common/docs/game-engine-overview.md](../../common/docs/game-engine-overview.md)
- **Breakpoint system**: [common/docs/game-engine-overview.md](../../common/docs/game-engine-overview.md#breakpoint-system)
- **InputRequestEvent**: [common/docs/input-request-system.md](../../common/docs/input-request-system.md)
