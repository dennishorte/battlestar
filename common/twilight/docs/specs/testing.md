# Twilight Imperium Testing Guide

## Philosophy

All tests are integration tests exercising the full game engine. No mocks, no calling internal methods directly. If it isn't tested end-to-end, there's no proof it works.

- `t.fixture()` creates a game
- `t.setBoard()` sets up state via breakpoint injection
- `game.run()` starts the engine
- `t.choose()` responds to select-type input requests
- `t.action()` responds to action-type input requests
- `t.testBoard()` asserts game state declaratively

Never call game methods directly in tests — no `game.spaceCombat()`, no `player.addUnit()`. The engine is a black box.

---

## Core Pattern

```js
const t = require('../testutil')

test('tactical action: activate system spends tactic token', () => {
  const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
  t.setBoard(game, {
    dennis: {
      commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
    },
  })
  game.run()
  // Pick strategy cards
  t.choose(game, 'leadership')  // dennis
  t.choose(game, 'diplomacy')   // micah

  // Dennis takes tactical action (lowest initiative goes first)
  t.choose(game, 'Tactical Action')
  t.action(game, 'activate-system', { systemId: '27' })
  // ...

  t.testBoard(game, {
    dennis: {
      commandTokens: { tactics: 2, strategy: 2, fleet: 3 },
    },
  })
})
```

---

## Test Utilities

### `t.fixture(options)`

Creates a game with deterministic seed and no seat shuffle.

| Option | Default | Description |
|--------|---------|-------------|
| `numPlayers` | `2` | Number of players |
| `factions` | auto | Array of faction IDs |
| `seed` | `'test_seed'` | Random seed |
| `players` | dennis, micah, scott | Player list |
| `deterministicLayout` | `true` (for 2p) | Use fixed galaxy layout instead of random tile placement |

### `t.setBoard(game, state)`

Sets up game state declaratively via `initialization-complete` breakpoint.

### `t.testBoard(game, expected)`

Asserts game state. Collects all errors and reports them together.

### `t.choose(game, ...selections)`

Responds to a select-type input request. Digit-only strings are converted to numbers — prefix with `*` to prevent this (e.g., `t.choose(game, '*37')` sends the string `'37'`).

### `t.action(game, actionName, opts)`

Responds to an action-type input request.

### `t.currentChoices(game)`

Returns current selector choices as plain strings.

---

## Galaxy Layout

### Deterministic layout (default for 2p)

By default, 2-player fixtures use a fixed tile placement so tests can reference known system IDs and adjacencies. This eliminates the need for runtime galaxy queries.

```
             P1 home
          [27]  [37]
       [48]  [26]  [24]
    [41]  [35]  [18]  [39]
       [44]  [34]  [20]
          [42]  [25]  [40]
             [36]  [19]  [47]
                [38]
             P2 home
```

Home systems: P1 (dennis) at `(0,-3)`, P2 (micah) at `(0,3)`. Mecatol Rex (18) at `(0,0)`.

**Key adjacencies:**

| System | Adjacent To |
|--------|------------|
| P1 home `(0,-3)` | 27 |
| P2 home `(0,3)` | 38, 36 |
| Mecatol 18 `(0,0)` | 26, 20, 19, 25, 34, 35 |
| 27 `(0,-2)` | P1 home, 37, 26, 48 |
| 37 `(1,-2)` | 27, 26, 24 |

**Tile contents:**

| Tile | Ring | Contents |
|------|------|----------|
| 26 | 1 | Lodor (alpha wormhole) |
| 20 | 1 | Vefut II |
| 19 | 1 | Wellon |
| 25 | 1 | Quann (beta wormhole) |
| 34 | 1 | Centauri + Gral |
| 35 | 1 | Bereg + Lirta IV |
| 27 | 2 | New Albion + Starpoint |
| 37 | 2 | Arinam + Meer |
| 24 | 2 | Mehar Xull |
| 38 | 2 | Abyz + Fria |
| 36 | 2 | Arnor + Lor |
| 39 | 2 | empty (alpha wormhole) |
| 40 | 2 | empty (beta wormhole) |
| 42 | 2 | nebula |
| 44 | 2 | asteroid field |
| 41 | 2 | gravity rift |
| 47, 48 | 2 | empty |

**Common test pattern** — P1 moves into system 27 (adjacent to P1 home):

```js
t.choose(game, 'Tactical Action')
t.action(game, 'activate-system', { systemId: '27' })
t.action(game, 'move-ships', {
  movements: [{ unitType: 'cruiser', from: 'sol-home', count: 3 }],
})
```

### Disabling the deterministic layout

Tests that need random tile placement (e.g., galaxy adjacency tests) should opt out:

```js
const game = t.fixture({ deterministicLayout: false })
```

### Custom layouts via setBoard

Override the galaxy with a custom tile arrangement:

```js
t.setBoard(game, {
  systems: {
    27: { q: 0, r: -2 },  // tile ID → hex position
    37: { q: 1, r: -2 },
  },
  dennis: { /* player state */ },
})
```

This removes all non-home, non-Mecatol systems and replaces them with the specified tiles. Planets on those tiles are initialized with no controller.

### 3+ player tests

The deterministic layout only applies to 2-player games. 3+ player tests use random tile placement (seeded). If a 3+ player test needs a specific system ID, use the Galaxy model to find adjacent systems at runtime:

```js
const { Galaxy } = require('../model/Galaxy.js')
const game = t.fixture({ numPlayers: 3, factions: [...] })
const setupGame = t.fixture({ numPlayers: 3, factions: [...] })
setupGame.run()
const galaxy = new Galaxy(setupGame)
const adjacent = galaxy.getAdjacent('sol-home')[0]
```

---

## setBoard Fields

### Game-Level

| Field | Type | Description |
|-------|------|-------------|
| `round` | Number | Round number (1+) |
| `phase` | String | `'strategy'`, `'action'`, `'status'`, `'agenda'` |
| `speaker` | String | Player name of the speaker |
| `custodiansRemoved` | Boolean | Enables agenda phase |
| `revealedObjectives` | Array | Revealed public objective IDs |
| `systems` | Object | Tile ID → `{ q, r }` — custom galaxy layout |

### Per-Player (keyed by player name)

| Field | Type | Description |
|-------|------|-------------|
| `faction` | String | Faction ID (e.g., `'federation-of-sol'`) |
| `units` | Object | System ID → `{ space: [...types], planetName: [...types] }` |
| `commandTokens` | Object | `{ tactics, strategy, fleet }` |
| `tradeGoods` | Number | Trade goods count |
| `commodities` | Number | Commodities count |
| `technologies` | Array | Tech IDs owned |
| `actionCards` | Array | Action card IDs in hand |
| `secretObjectives` | Array | Secret objective IDs |
| `scoredObjectives` | Array | Scored objective IDs |
| `victoryPoints` | Number | VP count |
| `planets` | Object | Planet ID → `{ exhausted: bool }` |
| `strategyCard` | String | Strategy card ID |
| `leaders` | Object | `{ agent, commander, hero }` with status strings |
| `promissoryNotes` | Array | Note IDs or `{ id, owner }` objects |

---

## testBoard Fields

Same structure as setBoard. Only checks specified fields.

**Defaults** (used when field is not specified):
- `commandTokens`: `{ tactics: 3, strategy: 2, fleet: 3 }`
- `tradeGoods`: `0`
- `commodities`: `0`
- `victoryPoints`: `0`
- `units`: per-faction starting units in home system
- `technologies`: per-faction starting technologies

---

## Action-Type Responses

Used with `t.action()` for board-click interactions.

| Action | `allowsAction` | Response Data |
|--------|----------------|---------------|
| Activate system | `activate-system` | `{ systemId }` |
| Move ships | `move-ships` | `{ movements: [{ unitType, from, count }] }` |
| Assign hits | `assign-hits` | `{ destroyed: [unitId...], sustained: [unitId...] }` |
| Commit ground forces | `commit-ground-forces` | `{ assignments: [{ planetId, units: [...] }] }` |
| Produce units | `produce-units` | `{ units: [{ type, planetId? }] }` |
| Cast votes | `cast-votes` | `{ outcome, planets: [planetId...] }` |
| Trade offer | `trade-offer` | `{ offering: {...}, requesting: {...} }` |
| Redistribute tokens | `redistribute-tokens` | `{ tactics, strategy, fleet }` |

---

## Writing Tests

### Test stubs first

Write `test.todo()` stubs for ALL cases before implementing any test or game logic:

```js
describe('Strategy Phase', () => {
  test.todo('speaker picks first')
  test.todo('cannot pick already-chosen card')
  test.todo('trade goods on unchosen cards')
  test.todo('3-4 player: two cards each, reverse pick order')
})
```

### Edge cases

Brainstorm edge cases per system:
- Cross-system interactions (wormhole movement, gravity rift risk rolls)
- Timing conflicts (when multiple abilities trigger simultaneously)
- Resource limits (fleet pool, unit supply)
- Boundary conditions (0 tokens, max VP, no valid targets)

### Deterministic replay

Same seed → same state. Tests should be reproducible.

---

## Gotchas

### Stale player references

After `t.choose()` or `t.action()`, the game replays from scratch. Player objects obtained before the call become stale. Always re-read the player after state-changing calls:

```js
// BAD — stale reference
const dennis = game.players.byName('dennis')
t.choose(game, dennis.actionCards[0].id)
expect(dennis.actionCards.length).toBe(2) // WRONG: still shows 3

// GOOD — re-read after choose
const cardId = game.players.byName('dennis').actionCards[0].id
t.choose(game, cardId)
const dennis = game.players.byName('dennis')
expect(dennis.actionCards.length).toBe(2) // correct
```

### Digit-only strings in t.choose

`t.choose` converts digit-only strings to numbers. System IDs like `'27'` are fine in `t.action` (which passes objects), but when used as choices in `t.choose`, prefix with `*`:

```js
t.choose(game, '*37')  // sends string '37', not number 37
```

### Naalu initiative

Naalu's `telepathic` ability gives initiative 0 (always first). When Naalu is player 2 (micah), they still go first in the action phase. Tests must account for this by having Naalu act before the other player.
