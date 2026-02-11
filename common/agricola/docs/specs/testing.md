# Writing Agricola Tests

This guide covers how to write card tests using `testutil_v2.js`.

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

## t.setBoard

Declaratively sets up game state. All fields are optional.

### Game-level fields

| Field | Description |
|-------|-------------|
| `firstPlayer` | Player name who goes first in the work phase |
| `round` | Round number to play (cannot combine with `actionSpaces`) |
| `actionSpaces` | Array of action space names to make available (cannot combine with `round`) |

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
t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
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
like `getEndGamePoints`. This is the right way to test scoring cards.

```js
t.testBoard(game, {
  dennis: {
    score: 12,
    minorImprovements: ['debt-security-a046'],
    majorImprovements: ['hearth-1', 'hearth-2'],
  },
})
```

Note: `bonusPoints` in `testBoard` checks the static property, not dynamic
hooks. Use `score` for cards with `getEndGamePoints`.

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
