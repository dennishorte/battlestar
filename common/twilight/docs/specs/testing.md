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
  const game = t.fixture()
  t.setBoard(game, {
    round: 1,
    dennis: {
      faction: 'federation-of-sol',
      commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
      strategyCard: 'leadership',
    },
    micah: {
      faction: 'emirates-of-hacan',
      strategyCard: 'diplomacy',
    },
  })
  game.run()

  // Dennis takes tactical action (lowest initiative goes first)
  t.choose(game, 'Tactical Action')
  t.action(game, 'activate-system', { systemId: 18 })
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

### `t.setBoard(game, state)`

Sets up game state declaratively via `initialization-complete` breakpoint.

### `t.testBoard(game, expected)`

Asserts game state. Collects all errors and reports them together.

### `t.choose(game, ...selections)`

Responds to a select-type input request.

### `t.action(game, actionName, opts)`

Responds to an action-type input request.

### `t.currentChoices(game)`

Returns current selector choices as plain strings.

---

## setBoard Fields

### Game-Level

| Field | Type | Description |
|-------|------|-------------|
| `round` | Number | Round number (1+) |
| `phase` | String | `'strategy'`, `'action'`, `'status'`, `'agenda'` |
| `speaker` | String | Player name of the speaker |
| `custodiansRemoved` | Boolean | Enables agenda phase |
| `laws` | Array | Active law card IDs |
| `publicObjectives` | Array | Revealed public objective IDs |

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
| Propose trade | `propose-trade` | `{ target, offering: {...}, requesting: {...} }` |
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

Same seed → same state. Tests should be reproducible:

```js
test('deterministic: same seed produces same galaxy', () => {
  const game1 = t.fixture({ seed: 'test' })
  const game2 = t.fixture({ seed: 'test' })
  game1.run()
  game2.run()
  // Same tile placements, same initial state
})
```
