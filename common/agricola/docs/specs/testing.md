# Writing Agricola Tests

This guide covers how to write card tests using `testutil_v2.js`.

**All tests are integration tests.** Every test must exercise the card through
the game engine — set up state with `t.setBoard`, run with `game.run()`, and
assert with `t.testBoard`. Never call card methods directly (e.g.,
`card.definition.getEndGamePoints()`, `card.definition.onReturnHome()`,
`card.definition.modifyFieldCost()`). Never use mock objects. If a card effect
can't be verified through `t.testBoard`, that's a sign the test setup needs
adjustment, not that the test should bypass the framework.

## Setup

```js
const t = require('../../../testutil_v2.js')
```

The test fixture creates a 2-player game (dennis, micah) with shuffled seats
disabled and the `test` card set included by default.

## Core Pattern

Every test follows this structure:

1. **Set up** the board state with `t.setBoard`
2. **Run** the game with `game.run()`
3. **Play** through turns with `t.choose` and `t.action`
4. **Assert** the final state with `t.testBoard`

## Turn Order and Action Space Rules

**CRITICAL**: When writing tests that involve multiple players or multiple actions:

1. **Turn Order**: The work phase alternates between players. After a player takes an action, the turn moves to the next player in turn order. If you need a player to take multiple actions, you must account for other players' turns in between.

2. **Action Space Usage**: Each action space can only be used ONCE per round. Once a player takes an action on a space, that space is occupied and cannot be used again until the next round. If you need to test a player taking multiple actions, use DIFFERENT action spaces for each action.

3. **Example Pattern for Multiple Actions by Same Player**:
   ```js
   // Player 1 takes action A
   t.choose(game, 'Action A')
   // Player 2 takes an action (turn order rotates)
   t.choose(game, 'Action B')
   // Player 1 takes action C (their second action)
   t.choose(game, 'Action C')
   ```

4. **Example Pattern for Testing "2nd Person" Effects**:
   ```js
   // If testing a card that triggers on "2nd person placed this round"
   // Player must place 2 workers, with another player's turn in between
   t.choose(game, 'First Action') // Player's 1st worker
   t.choose(game, 'Other Action') // Other player's turn
   t.choose(game, 'Second Action') // Player's 2nd worker - triggers effect
   ```

## t.setBoard

Declaratively sets up game state. All fields are optional.

### Game-level fields

| Field | Description |
|-------|-------------|
| `firstPlayer` | Player name who goes first in the work phase |
| `round` | Round number to play (cannot combine with `actionSpaces`) |
| `actionSpaces` | Array of action space refs to make available (cannot combine with `round`). Each element can be a string name/ID or `{ ref, accumulated }` for accumulating spaces. |

#### `round`

`round: N` plays round N. The game skips straight to that round — no earlier
rounds are played, and round cards are revealed randomly as usual. Use this
when you need a specific round (e.g., a harvest round) but don't care which
action spaces are available.

```js
t.setBoard(game, { round: 4 })  // plays round 4 (first harvest)
t.setBoard(game, { round: 8 })  // plays round 8
```

#### `actionSpaces`

Controls which round cards are available by name. Earlier stages are
auto-filled when needed. The round is set to `orderedCards.length + 1`
(the first round after all listed cards have been revealed).

```js
// Just Grain Utilization (stage 1). Fills no extras. Round = 2.
actionSpaces: ['Grain Utilization']

// Grain Utilization is stage 1, Western Quarry is stage 2.
// All 4 stage 1 cards are auto-filled, then Western Quarry is placed.
// 5 cards total → round = 6.
actionSpaces: ['Grain Utilization', 'Western Quarry']

// All 4 stage 1 cards listed explicitly → round = 5.
actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement']
```

Use `actionSpaces` when you need specific action spaces (e.g., Fencing,
Grain Utilization) available for the test. Use `round` when you need a
specific round number but can work with whatever actions are available.

**Important**: Only round cards count toward `orderedCards.length`. Base
actions like Farm Expansion, Grain Seeds, Farmland, Day Laborer, Forest,
Clay Pit, Reed Bank, Fishing, Meeting Place, and Lessons A are always
available and do **not** affect the round counter. If you need round 4
(first harvest) via `actionSpaces`, you must list 3 stage-1 round cards:

```js
// Stage-1 round cards: Grain Utilization, Sheep Market, Fencing, Major Improvement
// 3 round cards → orderedCards.length = 3 → game plays round 4 (first harvest)
actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing']

// WRONG: Farm Expansion and Grain Seeds are base actions, not round cards.
// Only Grain Utilization counts → orderedCards.length = 1 → game plays round 2.
actionSpaces: ['Grain Utilization', 'Farm Expansion', 'Grain Seeds']
```

### Per-player fields (keyed by name, e.g. `dennis`)

| Field | Description |
|-------|-------------|
| `food`, `wood`, `clay`, `stone`, `reed`, `grain`, `vegetables` | Resource counts (default: 0) |
| `familyMembers` | Number of family members (default: 2) |
| `roomType` | `'wood'`, `'clay'`, or `'stone'` (default: `'wood'`) |
| `beggingCards` | Number of begging cards (default: 0) |
| `bonusPoints` | Bonus points (default: 0) |
| `hand` | Card IDs in hand |
| `occupations` | Card IDs of played occupations |
| `minorImprovements` | Card IDs of played minor improvements |
| `majorImprovements` | Card IDs of played major improvements |
| `pet` | Animal type string or `null` |
| `farmyard.rooms` | Array of `{row, col}` for additional rooms beyond the default two |
| `farmyard.fields` | Array of `{row, col, crop?, cropCount?}` |
| `farmyard.pastures` | Array of `{spaces: [{row, col}], sheep?, boar?, cattle?}` |
| `farmyard.stables` | Array of `{row, col}` |

### Validation

`setBoard` validates the board after setup:
- Grid bounds (all coordinates within 3x5)
- Room adjacency (all rooms orthogonally connected)
- Field adjacency (all fields orthogonally connected)
- Pasture connectivity and capacity
- Card prereqs for all played cards

If validation fails, it throws a descriptive error.

### Test cards for prereqs

Many cards have prereqs like `occupations: 2`. Use the no-effect test cards
instead of real cards to avoid side effects:

- `test-occupation-1` through `test-occupation-8`
- `test-minor-1` through `test-minor-8`

These are included in the fixture by default and have no hooks or effects.

## Player Object Staleness

After any `t.choose()` or `t.action()` call, the game replays all responses
from scratch, creating **new player objects**. Any previously held reference
is stale and reflects old state. Always re-obtain player references after
game-state-changing calls:

```js
let dennis = game.players.byName('dennis')
expect(dennis.virtualFields).toHaveLength(1)  // OK — before any choose/action

t.choose(game, 'Grain Utilization')
t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

// dennis is now stale! Re-obtain:
dennis = game.players.byName('dennis')
expect(dennis.grain).toBe(0)  // reflects updated state
```

## `minorImprovements` vs Playing from Hand

`setBoard` with `minorImprovements` places cards directly into the played
zone **without calling `onPlay` hooks**. This is fine for cards whose effects
come from other hooks (e.g., `modifyPastureCapacity`, `onAction`), but cards
that create state in `onPlay` (like Beanfield creating a virtual field) won't
work. For those cards, put them in `hand` and play them during the test:

```js
// WRONG for Beanfield — onPlay never fires, no virtual field created:
t.setBoard(game, { dennis: { minorImprovements: ['beanfield-b068'] } })

// RIGHT — play from hand so onPlay fires:
t.setBoard(game, {
  dennis: {
    hand: ['beanfield-b068'],
    occupations: ['test-occupation-1', 'test-occupation-2'], // prereqs
    food: 1, // card cost
  },
})
game.run()
t.choose(game, 'Meeting Place')
t.choose(game, 'Minor Improvement.Beanfield')
```

## t.choose

Selects a choice from the current input request.

```js
t.choose(game, 'Day Laborer')        // select an action space
t.choose(game, 'Pay 1 grain for 1 bonus point')  // select from a card's offer
t.choose(game, 'Done building fences')
```

Action space names do NOT include accumulated amounts. Use `'Forest'`, not
`'Forest (3)'`.

## t.currentChoices

Returns the current selector's choices as an array of plain strings. Useful for
asserting that a specific option is or isn't available.

```js
expect(t.currentChoices(game)).toContain('Chapel')
expect(t.currentChoices(game)).not.toContain('Chapel')
```

For accumulating actions, returns just the name (e.g. `'Forest'`) without the
accumulated amount.

## t.action

Responds to an action-type input request (board interactions like building
pastures or sowing fields).

```js
t.action(game, 'build-pasture', {
  spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }],
})
t.action(game, 'done-building-pastures')  // finish fencing action
t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
t.action(game, 'sow-virtual-field', { fieldId: 'beanfield-b068', cropType: 'vegetables' })
```

## t.testBoard

Declaratively asserts game state. Only checks players explicitly mentioned.
Every property is checked against defaults, so unspecified properties are
asserted to be at their default value (0 for resources, `[]` for card arrays,
default farmyard layout, etc.).

### Defaults

Resources default to 0. Cards default to `[]`. Farmyard defaults to two wood
rooms at `(0,0)` and `(1,0)`, no fields, no pastures, no stables.

### Farmyard assertions

Use arrays to assert detailed farmyard state:

```js
t.testBoard(game, {
  dennis: {
    farmyard: {
      fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
      pastures: [
        { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] },
        { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] },
      ],
    },
  },
})
```

### Scheduled delivery assertions

Some cards schedule resources or events for future rounds (e.g. Farmyard Manure
schedules food, Handplow schedules plows). These are opt-in — only checked when
explicitly specified. Use `scheduled` with resource names (`{ round: amount }`)
or event names (`[round, ...]`):

```js
t.testBoard(game, {
  dennis: {
    scheduled: {
      food: { 5: 1, 6: 1, 7: 1 },
      plows: [8],
    },
  },
})
```

Resource types: `food`, `wood`, `clay`, `stone`, `reed`, `grain`, `vegetables`,
`vegetablesPurchase`, `sheep`, `boar`, `cattle`.

Event types: `plows`, `freeStables`, `freeOccupation`, `woodWithMinor`,
`plowman`.

When specified, all rounds are checked — any rounds not listed are asserted to
be 0 (resources) or absent (events).

### Other assertions

```js
t.testBoard(game, {
  firstPlayer: 'micah',
  round: 3,
  dennis: { ... },
})
```

## Testing a Full Round

Some cards trigger during specific game phases (e.g. return home). To reach
those phases, all workers must be placed first. With 2 players and 2 workers
each, that means 4 action choices alternating between players.

```js
t.choose(game, 'Day Laborer')   // dennis turn 1
t.choose(game, 'Forest')        // micah turn 1
t.choose(game, 'Grain Seeds')   // dennis turn 2
t.choose(game, 'Clay Pit')      // micah turn 2
// Return home phase now fires automatically
```

The game then continues to the next round and pauses waiting for the first
player's action. Call `t.testBoard` at that point to check state.

## Animal Placement Prompts

Actions that give animals (Sheep Market, Pig Market, Cattle Market) trigger an
animal placement prompt before the action fully completes. Card hooks
(`onAction`, `onAnyAction`) fire only after animal placement is resolved. Tests
must respond to the placement prompt before asserting state:

```js
t.choose(game, 'Pig Market')    // take the action
t.choose(game, 'Place Animals') // respond to animal placement
// hooks have now fired — safe to assert
```

Remember to account for the animals in `t.testBoard` assertions. A single
animal with no pastures becomes a house pet:

```js
t.testBoard(game, {
  micah: {
    pet: 'boar',
    animals: { boar: 1 },
  },
})
```

## Score Assertions

Use the `score` field in `testBoard` to assert a player's total score. This
calls `player.calculateScore()` dynamically, including all bonus point hooks
like `getEndGamePoints` and static `vps` on cards. This is the **only** way
to test scoring — never call `getEndGamePoints()` or read `card.definition.vps`
directly in tests.

For cards whose only effect is endgame scoring, you don't need to take any
actions. Just place the card in `minorImprovements`, call `game.run()`, and
assert `score` in `testBoard`:

```js
test('scores 3 VP for 3 stone rooms', () => {
  const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      minorImprovements: ['half-timbered-house-c030'],
      roomType: 'stone',
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      },
    },
  })
  game.run()
  t.testBoard(game, {
    dennis: {
      score: -4,
      minorImprovements: ['half-timbered-house-c030'],
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      },
    },
  })
})
```

Note: `bonusPoints` in `testBoard` checks the static property, not dynamic
hooks. Always use `score` for cards with `getEndGamePoints` or `vps`.

## Occupied Action Space Override

Cards with `canUseOccupiedActionSpace` hooks let a player use an action space
that another player has already occupied. In tests, have one player take the
space first, then the card owner takes it despite it being occupied.

```js
// micah occupies Lessons A
t.choose(game, 'Lessons A')
t.choose(game, 'Frame Builder')

// dennis takes Lessons A despite occupied (Forest School override)
t.choose(game, 'Lessons A')
t.choose(game, 'Wall Builder')
```

## Multi-Room Building

Cards with `modifyMultiRoomCost` enable building multiple rooms at once. When
the card is played, "Build 2 Rooms" / "Build 3 Rooms" options appear alongside
"Build Room" in Farm Expansion. Each room location is chosen separately.

```js
t.choose(game, 'Farm Expansion')
t.choose(game, 'Build 2 Rooms')
t.choose(game, '0,1')  // first room location
t.choose(game, '1,1')  // second room location
```

## Minor Improvement Conversions

Minor improvements with `bakingConversion` integrate with the baking system.
When a player has such a card and takes "Grain Utilization" (no fields → skips
sow, goes straight to baking), baking choices appear automatically.

Minor improvements with `anytimeConversions` appear during harvest feeding as
conversion options (e.g. `'Oriental Fireplace: vegetables → 4 food'`).

### Anytime Non-Food Actions (e.g., Crop Move)

Non-food anytime actions (like Clearing Spade's crop move) appear in the
anytime actions side panel, not as regular choices. To trigger them in tests,
use `respondToInputRequest` directly with the `anytime-action` shape:

```js
function respondAnytimeAction(game, anytimeAction) {
  const request = game.waiting
  const selector = request.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: 'anytime-action', anytimeAction },
  })
}

// Trigger during any choose() prompt (before choosing main action)
respondAnytimeAction(game, {
  type: 'crop-move',
  cardName: 'Clearing Spade',
  description: 'Clearing Spade: Move 1 crop to empty field',
})
t.choose(game, '2,0 (grain x3)')  // pick source field
t.choose(game, '2,1')              // pick target field
// Main action choice follows
t.choose(game, 'Day Laborer')
```

See `docs/specs/anytime-actions.md` for the full anytime actions architecture.

## Occupation Count and Costs

The occupation count is derived from `player.getOccupationCount()` which
returns `playedOccupations.length` (the occupations zone). The first
occupation is free; subsequent ones cost food. Set `occupations` in
`setBoard` to control the count:

```js
t.setBoard(game, {
  dennis: {
    occupations: ['frame-builder-a123'],  // 1 played → next costs food
    hand: ['wall-builder-a111'],
  },
})
```

## Example Tests by Hook

### onUseMultipleSpaces (triggered when 2+ unused spaces become used)

**Agricultural Fertilizers** (`res/cards/minorA/AgriculturalFertilizers.test.js`)
— Grants a sow action after fencing 2+ spaces into a pasture. Uses
`actionSpaces: ['Fencing']` to make fencing available, then `t.action` to build
a pasture and sow a field.

### onAnyAction (triggered when any player takes a specific action)

**Hod** (`res/cards/minorA/Hod.test.js`) — Gives 2 clay when any player
(including the owner) uses Pig Market. Sets `firstPlayer: 'micah'` so micah
acts first, responds to the animal placement prompt, then asserts dennis
received clay.

### onReturnHome (triggered during the return home phase)

**Ale-Benches** (`res/cards/minorA/AleBenches.test.js`) — Offers to pay 1 grain
for 1 bonus point during return home, giving other players 1 food. Plays
through a complete round to reach the return home phase.

### onActionSpaceUsed (card-provided action spaces)

Cards with `providesActionSpace: true` register as action spaces when played.
In `setBoard`, placing such a card in `minorImprovements` automatically
registers the action space. The card's name becomes a choosable action.

**Chapel** (`res/cards/minorA/Chapel.test.js`) — Provides an action space that
grants 3 bonus points. Non-owners must pay 1 grain. Cards can also define
`canUseActionSpace` to gate availability (e.g. Chapel excludes non-owners
without grain). Use `t.currentChoices` to assert availability:

```js
t.setBoard(game, {
  firstPlayer: 'micah',
  dennis: {
    occupations: ['test-occupation-1', 'test-occupation-2'],
    minorImprovements: ['chapel-a039'],
  },
  micah: { grain: 0 },
})
game.run()

expect(t.currentChoices(game)).not.toContain('Chapel')
```

## Accumulated Resources on Action Spaces

For accumulating action spaces (Fishing, Forest, Clay Pit, Reed Bank, etc.),
you can control the accumulated amount using an object form in `actionSpaces`:

```js
actionSpaces: [
  { ref: 'Fishing', accumulated: 2 },   // Fishing will have exactly 2 food
  { ref: 'Forest', accumulated: 5 },     // Forest will have exactly 5 wood
  'Grain Utilization',                    // plain string still works
]
```

The `accumulated` value is the amount the player sees when they take their
turn — i.e., the amount **after** the round's replenish phase. This is the
intuitive value: if you say `accumulated: 3`, the player gets 3 resources
when they use that space.

For non-accumulating action spaces, `accumulated` is ignored.

## Debugging Tests

When a test fails because a choice string doesn't match, or the game flow
is unexpected, use these techniques to inspect what's actually happening.

### Inspect the current waiting state

The most useful debugging tool. When the game is paused waiting for input,
`game.waiting` contains the full input request with all available choices:

```js
// See what choices are currently being presented
console.log(t.currentChoices(game))

// See the full waiting structure (actor, title, choices, min, max)
console.log(JSON.stringify(game.waiting, null, 2))
```

Use this whenever you get "Invalid selection" errors — it shows exactly what
choices are available and what the expected format is.

### Dump the game log

To see the sequence of game events leading up to the current state:

```js
// Print all log entries with indentation
game.log.getLog().forEach(entry => {
  const indent = '  '.repeat(entry.indent)
  console.log(`${indent}${entry.template}`)
})
```

This shows the full game flow — which actions were taken, what resources
were gained, what hooks fired, etc. Extremely useful for understanding why
the game is in a particular state.

### When to use these techniques

- **"Invalid selection" errors**: Use `t.currentChoices(game)` or
  `console.log(game.waiting)` right before the failing `t.choose` call to
  see what choices are actually available.
- **Unexpected resource counts**: Dump the log to trace where resources
  were gained or spent.
- **Hook not firing**: Dump the log to see if the expected action was taken
  and whether the hook's log messages appear.
- **buyImprovement skipping**: If `buyImprovement` finds no affordable
  improvements and no anytime conversions, it returns immediately without
  presenting choices. Check that the player has playable cards in hand and
  the `test` card set is included in the fixture.

**Important**: Remove all `console.log` debugging statements before
committing. These are development-only aids.
