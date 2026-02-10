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
| `round` | Set the round number (cannot combine with `actionSpaces`) |
| `actionSpaces` | Array of action space names to make available (e.g. `['Fencing']`) |

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
