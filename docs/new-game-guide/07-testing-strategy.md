# 7. Testing Strategy

All game logic tests are integration tests exercising the full game engine. No mocks, no calling internal methods directly. If it isn't tested end-to-end, there's no proof it works.

---

## Philosophy

- The engine is a black box: set up state, run, make choices, assert results
- Never call game methods directly in tests (no `player.addResource()`, no `game.spaceCombat()`)
- Test through the public interface: `game.run()`, `t.choose()`, `t.action()`, `t.testBoard()`
- Deterministic replay means same seed produces same results -- tests are reproducible

---

## Building testutil.js

Every game needs a `testutil.js` that extends the shared `TestCommon` helpers. This is the most important infrastructure investment for your game.

### Skeleton

```javascript
const TestCommon = require('../../lib/test_common')
const { GameFactory } = require('./<game>')

const TestUtil = { ...TestCommon }
module.exports = TestUtil

// Shorthand
const t = TestUtil
```

### fixture(options)

Creates a game with deterministic seed and no seat shuffle:

```javascript
TestUtil.fixture = function(options = {}) {
  const players = options.players || [
    { _id: 'p1', name: 'dennis' },
    { _id: 'p2', name: 'micah' },
  ]

  const game = GameFactory({
    game: 'My Game',
    name: 'test_game',
    seed: options.seed || 'test_seed',
    players,
    numPlayers: players.length,
    shuffleSeats: false,
    ...options,
  })

  return game
}
```

### setBoard(game, state)

Declaratively sets up game state via the `initialization-complete` breakpoint:

```javascript
TestUtil.setBoard = function(game, state) {
  game.testSetBreakpoint('initialization-complete', (game) => {
    // Game-level state
    if (state.round !== undefined) game.state.round = state.round
    if (state.phase !== undefined) game.state.phase = state.phase

    // Per-player state
    for (const playerName of ['dennis', 'micah', 'scott']) {
      if (state[playerName]) {
        applyPlayerState(game, playerName, state[playerName])
      }
    }
  })
}

function applyPlayerState(game, name, state) {
  const player = game.players.byName(name)

  // Resources
  for (const resource of ['gold', 'food', 'wood', 'stone']) {
    if (state[resource] !== undefined) {
      player.setCounter(resource, state[resource], { silent: true })
    }
  }

  // Cards
  if (state.hand) {
    // Move specified cards to player's hand zone
  }

  // ... other game-specific state
}
```

Design `setBoard` to cover all the state you commonly need in tests. If you find yourself using `testSetBreakpoint` directly, that's a signal to add the field to `setBoard`.

### testBoard(game, expected)

Declaratively asserts game state. Only checks fields that are explicitly specified:

```javascript
TestUtil.testBoard = function(game, expected) {
  const errors = []

  for (const playerName of Object.keys(expected)) {
    if (['round', 'phase', 'firstPlayer'].includes(playerName)) {
      // Game-level assertions
      if (playerName === 'round') {
        assertEq(errors, 'round', game.state.round, expected.round)
      }
      continue
    }

    const player = game.players.byName(playerName)
    const exp = expected[playerName]

    // Resource assertions
    for (const resource of ['gold', 'food', 'wood', 'stone']) {
      if (exp[resource] !== undefined) {
        assertEq(errors, `${playerName}.${resource}`, player.getCounter(resource), exp[resource])
      }
    }

    // ... other assertions
  }

  if (errors.length > 0) {
    throw new Error('testBoard failures:\n' + errors.join('\n'))
  }
}
```

**Key design choice**: `testBoard` should collect all errors and report them together, not fail on the first mismatch. This makes debugging much faster.

### choose(game, ...selections)

Wraps `TestCommon.choose` with game-specific behavior if needed:

```javascript
TestUtil.choose = function(game, ...selections) {
  return TestCommon.choose(game, ...selections)
}
```

`t.choose` accepts several selection forms:

| Form | Use |
|------|-----|
| `'Name'` | Match a choice by title. Throws with a candidate list when multiple choices share the title *and* have distinct `defId`s. |
| `'*37'` | Leading `*` returns the literal — escape hatch for digit-only strings that shouldn't be coerced to numbers. |
| `'Parent.Child'` | Nested form: pick `Child` inside `Parent`. |
| `{ id: '...' }` | Disambiguate by stable choice id. |
| `{ kind: '...', name: '...' }` | Disambiguate by kind + title. |
| `{ title, selection: [...] }` | Pass a full nested response unchanged. |

The helper is **ambiguity-aware**: if a prompt contains two choices that share a title but have different `defId`s (e.g. an imperium card and a conflict card both named "Desert Power"), `t.choose(game, 'Desert Power')` throws with a candidate list rather than picking one silently. Use the `{id}` or `{kind, name}` form to disambiguate. Multiple *copies* of the same card (same `defId`, different instance ids) remain interchangeable and don't trigger the error.

When a matched choice carries an id, `t.choose` emits a structured `{title, id}` selection automatically so the stored response is stable against future prompts gaining duplicates.

### action(game, actionName, opts)

For games with board-click interactions:

```javascript
TestUtil.action = function(game, actionName, opts = {}) {
  const selector = game.waiting.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: actionName, ...opts },
  })
}
```

### currentChoices(game)

Returns the current selector's choices as plain strings -- essential for debugging:

```javascript
TestUtil.currentChoices = function(game) {
  const selector = game.waiting.selectors[0]
  return selector.choices.map(c => typeof c === 'object' ? c.title : String(c))
}
```

---

## Test-First Stubs

Before implementing any game logic or card, write `test.todo()` stubs for all test cases:

```javascript
describe('Combat System', () => {
  test.todo('attacker wins when scoring more hits')
  test.todo('defender wins ties')
  test.todo('units with sustain damage can absorb one hit')
  test.todo('retreating player moves to adjacent system')
  test.todo('combat ends when one side is eliminated')
  test.todo('anti-fighter barrage fires before main combat')
})
```

This forces you to think through all behaviors, edge cases, and interactions before writing any implementation. Only after all stubs are written should you fill them in.

---

## Critical Gotchas

### State After run() Is Lost

The engine replays from scratch on every `t.choose()` or `t.action()`. State set directly on `game.state` after `game.run()` is lost:

```javascript
// BAD -- state is lost on next t.choose()
game.run()
game.state.specialFlag = true
t.choose(game, 'some-action')  // replays from scratch, specialFlag is gone

// GOOD -- use setBoard, which injects via breakpoint
t.setBoard(game, { specialFlag: true })
game.run()
t.choose(game, 'some-action')  // state survives because breakpoint re-applies it
```

### Stale Player References

After `t.choose()` or `t.action()`, player objects from before the call are stale:

```javascript
// BAD
const dennis = game.players.byName('dennis')
t.choose(game, 'some-action')
expect(dennis.gold).toBe(5)  // WRONG: dennis is stale, shows old state

// GOOD
t.choose(game, 'some-action')
const dennis = game.players.byName('dennis')
expect(dennis.gold).toBe(5)  // correct: fresh reference
```

### Auto-Response

When a choice has only one valid option, the engine auto-selects it. Your next `t.choose()` will be consumed by the *following* input request. Use `t.currentChoices(game)` to debug when choices don't match expectations.

---

## Common Test Patterns

### Basic Game Flow

```javascript
test('player takes action and gains resources', () => {
  const game = t.fixture()
  t.setBoard(game, {
    dennis: { gold: 0 },
  })
  game.run()

  t.choose(game, 'Mine Gold')

  t.testBoard(game, {
    dennis: { gold: 3 },
  })
})
```

### Card Effect

```javascript
test('Shield Wall prevents 1 hit', () => {
  const game = t.fixture()
  t.setBoard(game, {
    dennis: { hand: ['shield-wall'], actionCards: 1 },
  })
  game.run()

  // Set up combat scenario...
  t.choose(game, 'Play Action Card')
  t.choose(game, 'Shield Wall')

  t.testBoard(game, {
    dennis: { /* expected state after shield wall prevents a hit */ },
  })
})
```

### Full Round

Place all workers / take all turns to trigger end-of-round effects:

```javascript
test('end of round scoring triggers', () => {
  const game = t.fixture()
  t.setBoard(game, { round: 1, dennis: { ... }, micah: { ... } })
  game.run()

  // All player turns for the round
  t.choose(game, 'Action A')   // dennis
  t.choose(game, 'Action B')   // micah
  t.choose(game, 'Action C')   // dennis
  t.choose(game, 'Action D')   // micah
  // End-of-round fires automatically

  t.testBoard(game, { dennis: { score: 3 }, micah: { score: 1 } })
})
```

### Edge Cases

Test boundary conditions explicitly:

```javascript
test('cannot take action with 0 resources', () => {
  const game = t.fixture()
  t.setBoard(game, { dennis: { gold: 0 } })
  game.run()

  expect(t.currentChoices(game)).not.toContain('Buy Upgrade')
})
```

---

## Game-Specific Testing Docs

Write a testing guide specific to your game at `common/<game>/docs/specs/testing.md`. It should include:

1. **Setup**: How to import testutil, default fixture configuration
2. **setBoard reference**: All supported fields with descriptions and defaults
3. **testBoard reference**: All assertion fields with defaults
4. **Action reference**: Available action spaces/actions and how to select them
5. **Common patterns**: Game-specific test patterns (e.g., full round, combat, scoring)
6. **Debugging tips**: How to inspect state when tests fail

See Agricola's testing guide (`common/agricola/docs/specs/testing.md`) and Twilight's testing guide (`common/twilight/docs/specs/testing.md`) as reference implementations.

---

## The Audit Phase

After cards and abilities reach nominal 100% implementation, schedule an explicit per-card audit pass. The audit is where the engine's hidden bugs surface — not while writing the original card. Treat the bug count as a project KPI, not a regression.

### Budget

- Reserve **at least 20% of total project time** for the audit phase. Dune spent ~1.5 of ~6 weeks on audits.
- Expect **5–10 engine bugs per ~50 cards audited**. Dune's three audit sweeps (`6e44883dc`, `e2e0ae89e`, `cf13e480a`) found 6, 5, and 9 engine bugs across imperium, intrigue, and parser respectively.
- An audit pass with **zero** engine bugs is suspect — either the audit isn't exhaustive or the audit happened too late, after fixes were already done piecemeal.

### Per-card audit checklist

For each card, write integration tests that exercise:

- [ ] **Happy path** — primary effect resolves with default conditions
- [ ] **Each conditional branch** — every "if" / "or" / "may" produces tests for all sides
- [ ] **Cost edge cases** — paying with each valid resource alternative; insufficient resources blocks play
- [ ] **Empty state** — no targets available; engine prompts or skips correctly
- [ ] **Mid-phase activation** — card placed mid-turn, mid-phase, or between rounds where relevant
- [ ] **Multi-player prompts** — when targeting opponents, every opponent count (2p / 3p / 4p)
- [ ] **Persistence boundary** — flag-setting effects survive the phase boundary they're supposed to and don't survive the ones they shouldn't
- [ ] **Structured choice prompts** — no bare-string options collide with anything else in the choice set
- [ ] **Hidden-info safety** — prompts fire even when the player has nothing relevant (no "no prompt = no card" leak)
- [ ] **Log output** — every meaningful decision creates a log line

### Track engine bugs separately during audit

Maintain `common/<game>/docs/known-bugs.md` during the audit. Each pass finds bugs faster than they can be fixed — batching them keeps the audit moving and clusters related fixes into coherent commits (e.g. "parser bugs", "phase-boundary bugs").

Skip the failing tests with a comment referencing the entry in `known-bugs.md`, then come back and unskip them after the engine fix.

Delete `known-bugs.md` once the backlog clears. Dune's file was 178 lines at peak (`6e44883dc`); cleared and deleted by `242d618cb` once all 24 bugs were resolved.

### Audit completion criteria

The audit is done when:

- [ ] Every card has at least one integration test covering primary effect + each conditional branch
- [ ] `known-bugs.md` is empty or deleted
- [ ] No skipped tests remain (or each remaining skip references a tracked, accepted engine limitation)
- [ ] At least one test exercises every hook the engine fires (no orphan hooks added "just in case")
- [ ] Random play of 5+ full games surfaces no uncaught exceptions

---

## References

- **Test infrastructure**: [docs/testing.md](../testing.md)
- **Agricola testing guide**: `common/agricola/docs/specs/testing.md`
- **Twilight testing guide**: `common/twilight/docs/specs/testing.md`
- **Innovation testing guide**: `common/ultimate/docs/TESTING_CARDS.md`
