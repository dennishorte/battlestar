# How to Write Tests for Cards

This guide explains how to write tests for Innovation cards, optimized for LLM usage. Start with the examples, then reference the detailed sections as needed.

## Quick Start: Complete Example

```javascript
Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe('Philosophy', () => {
  test('dogma: choose a color', () => {
    const game = t.fixtureTopCard('Philosophy')
    t.setBoard(game, {
      dennis: {
        purple: ['Philosophy'],
        red: ['Construction', 'Industrialization'],
      }
    })
    
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Philosophy')
    t.choose(game, request, 'red')
    
    const red = game.zones.byPlayer(t.dennis(game), 'red')
    expect(red.splay).toBe('left')
  })
})
```

## Test Structure

Every test file follows this structure:

```javascript
Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe('CardName', () => {
  test('test description', () => {
    // Test implementation
  })
})
```

## Essential Test Utilities

### Game Setup
- **`t.fixtureFirstPlayer(options)`** - Creates game, advances to first player's turn (most common)
- **`t.fixtureTopCard(cardName, options)`** - Creates game with card as top card
- **`t.fixture(options)`** - Basic game fixture
- **`t.setBoard(game, state)`** - **ONLY way to set up game state** (see below)

### Game Interaction
- **`t.choose(game, request, ...selections)`** - Makes selections (auto-advances game)
- **`game.run()`** - Run game until input needed (call once at start)

### Assertions
- **`t.testBoard(game, expectedState)`** - **Always use this** for state assertions
- **`t.testIsSecondPlayer(game)`** - Verify turn advanced
- **`t.testChoices(request, expected)`** - Verify available choices

### Helpers
- **`t.dennis(game)`** - Get dennis player
- **`t.cards(game, zoneName, playerName)`** - Get card names from zone

## Setting Up Game State

**CRITICAL**: Always use `t.setBoard()` - never use `setHand`, `setColor`, etc. directly.

```javascript
t.setBoard(game, {
  dennis: {
    red: ['Archery'],
    blue: ['Tools'],
    hand: ['Gunpowder', 'Currency'],
    score: ['The Wheel'],
    green: {
      cards: ['Agriculture', 'Domestication'],
      splay: 'left'  // 'left', 'right', 'up', or 'none'
    }
  },
  micah: {
    hand: ['Mathematics'],
  },
  achievements: ['Machinery', 'Navigation'],
  junk: ['Construction'],
  decks: {
    base: {
      1: ['Tools'],  // Top card of age 1 deck
      2: ['Mathematics', 'Construction'],  // Top cards in order
    },
    figs: {
      3: ['Al-Kindi'],
    }
  }
})
```

**Important Rules:**
- Card ages in `decks` must match deck age (age 3 card → age 3 deck)
- Always specify cards that will be drawn in `decks` for deterministic tests
- Card order matters: meld = front, tuck = end
- **CRITICAL: Only top card (first in array) can be dogmatized** - If you need to dogma a card, it MUST be the first card in its color array. If you put another card before it in the array, you cannot dogma it. Always check that the card you want to dogma is at index 0 of its color stack.

## Reference: Cards for Testing Actions

Quick lookup for cards to use in tests:

### Meld Actions
- **Tools** (blue, age 1) - Meld {3} or meld three {1}
- **Sailing** (green, age 1) - "Draw and meld a {1}"
- **Mathematics** (blue, age 2) - Return card, then meld one higher
- **Road Building** (red, age 2) - "Meld one or two cards"
- **Engineering** (red, age 3), **Enterprise** (green, age 4), **Quantum Theory** (blue, age 5)

### Score Actions
- **Agriculture** (yellow, age 1) - Return card, draw and score one higher
- **Pottery** (blue, age 1) - Return up to 3, draw and score equal to count
- **Mapmaking** (green, age 2), **Navigation** (green, age 4), **Statistics** (yellow, age 5)
- **Canning** (yellow, age 10) - High-value for score pile setup

### Return Actions
- **Agriculture** (yellow, age 1), **Pottery** (blue, age 1), **Tools** (blue, age 1), **Mathematics** (blue, age 2)

### Tuck Actions
- **Code of Laws** (purple, age 1) - "You may tuck a card from your hand"

### Junk Actions
- **Archery** (red, age 1) - "Junk an available achievement of value 1 or 2"
- **Machinery** (red, age 3), **Navigation** (green, age 4), **Reformation** (purple, age 5) - Achievement cards

### Transfer/Demand Actions
- **Archery** (red, age 1) - "I demand you draw a {1}, then transfer highest card"
- **Construction** (red, age 2) - "I demand you transfer two cards"
- **Gunpowder** (red, age 4), **Currency** (yellow, age 4)

### Draw Actions
- **The Wheel** (green, age 1) - "Draw two {1}" - Very common
- **Writing** (blue, age 1) - "Draw a {2}"
- **Calendar** (green, age 2), **Engineering** (red, age 3), **Experimentation** (blue, age 4)
- **Measurement** (blue, age 5), **Industrialization** (yellow, age 6)
- **Lighting** (green, age 7), **Explosives** (red, age 7)
- **Skyscrapers** (yellow, age 8), **Rocketry** (red, age 8)
- **Services** (yellow, age 9), **Suburbia** (green, age 9), **Specialization** (blue, age 9)
- **Databases** (blue, age 10)

### Splay Actions
- **Philosophy** (purple, age 2) - "You may splay left any one color"
- **Code of Laws** (purple, age 1) - Tuck then splay
- **Paper** (blue, age 4)

### Cards with Specific Biscuits
- **{k}**: Archery (red, 1), Metalworking (red, 1), Road Building (red, 2)
- **{s}**: Tools (blue, 1), Writing (blue, 1), Mathematics (blue, 2)
- **{c}**: Optics (red, 3), Translation (blue, 3), Skyscrapers (yellow, 8)
- **{f}**: Corporations (green, 6), Fermenting (yellow, 2)

### Achievement Cards
- **The Wheel** (green, age 1), **Mathematics** (blue, age 2), **Machinery** (red, age 3)
- **Navigation** (green, age 4), **Reformation** (purple, age 5)

### Figure Cards for Testing
- **Age 1**: Fu Xi (decree + draw karma), Homer (junk/return karma), Shennong (draw karma)
- **Age 2**: Archimedes (decree + effect age karma), Augustus Caesar (dogma {k} karma)
- **Age 3**: Al-Kindi, Alhazen (draw-action karma)
- **Age 5**: Peter the Great (decree + return karma), Antonie Van Leeuwenhoek (draw + achieve karma), Johannes Vermeer (meld + achieve karma)
- **Age 6**: Carl Friedrich Gauss (meld karma), Napoleon Bonaparte (decree + score/return karma), Shivaji (achieve + dogma karma)

## Reference: Karma Implementation Examples

### `would-first` Pattern

**Archimedes** - Increase effect age:
```javascript
{
  trigger: 'dogma',
  karmaKind: 'would-first',
  matches: () => true,
  func(game, player, card, age) {
    game.state.dogmaInfo.globalAgeIncrease = 1
  }
}
```

**Carl Friedrich Gauss** - Meld other cards of same age first:
```javascript
{
  trigger: 'meld',
  kind: 'would-first',
  matches: () => true,
  func(game, player, { card }) {
    const age = game.actions.chooseAge(player)
    const hand = game.cards.byPlayer(player, 'hand')
      .filter(card => card.getAge() === age)
      .filter(other => other !== card)
    const score = game.cards.byPlayer(player, 'score')
      .filter(card => card.getAge() === age)
    const cards = util.array.distinct([...hand, ...score])
    if (cards.length === 0) {
      game.log.addNoEffect()
    } else {
      game.actions.meldMany(player, cards)
    }
  }
}
```

**Peter the Great** - Score bottom green before return:
```javascript
{
  trigger: 'return',
  kind: 'would-first',
  matches: () => true,
  func: (game, player) => {
    const card = game.cards.bottom(player, 'green')
    if (card) {
      game.actions.score(player, card)
      if (card.checkHasBiscuit('c')) {
        const toAchieve = game.cards.bottom(player, 'green')
        if (toAchieve && game.checkAchievementEligibility(player, toAchieve)) {
          game.actions.claimAchievement(player, toAchieve)
        }
      }
    }
  }
}
```

**Johannes Vermeer** - Score all cards of color before meld:
```javascript
{
  trigger: 'meld',
  kind: 'would-first',
  matches: () => true,
  func: (game, player) => {
    const colors = game.cards.tops(player).map(card => card.color)
    const color = game.actions.chooseColor(player, colors)
    if (color) {
      game.actions.scoreMany(player, game.cards.byPlayer(player, color))
    }
  }
}
```

**Antonie Van Leeuwenhoek** - Optional return before draw:
```javascript
{
  trigger: 'draw',
  kind: 'would-first',
  matches: () => true,
  func: (game, player) => {
    const age5Cards = game.cards.byPlayer(player, 'hand')
      .filter(card => card.getAge() === 5)
    if (age5Cards.length === 0) return
    const returned = game.actions.chooseAndReturn(player, age5Cards, { min: 0, max: 1 })
    if (returned.length > 0) {
      game.actions.draw(player, { age: 6 })
    }
  }
}
```

**Shivaji** - Opponent claims achievement, owner claims another first (with `triggerAll: true`):
```javascript
{
  trigger: 'achieve',
  triggerAll: true,
  kind: 'would-first',
  matches: (game, player, { owner }) => player.id !== owner.id,
  func: (game, player, { card, owner }) => {
    // 'player' = opponent taking action, 'owner' = karma card owner
    const choices = game.getAvailableStandardAchievements(owner)
      .filter(achievement => achievement.id !== card.id)
      .filter(achievement => game.checkAchievementEligibility(owner, achievement))
    game.actions.chooseAndAchieve(owner, choices)
  }
}
```

### `would-instead` Pattern

**Homer** - Tuck instead of junk/return:
```javascript
{
  trigger: ['junk', 'return'],
  kind: 'would-instead',
  matches(game, player, { card }) {
    return card.checkIsFigure() && card.zone.isHandZone()
  },
  func(game, player, { card }) {
    return game.actions.tuck(player, card)
  }
}
```

**Augustus Caesar** - Draw and reveal instead of dogma (with `triggerAll: true`):
```javascript
{
  trigger: 'dogma',
  triggerAll: true,
  kind: 'would-instead',
  matches: (game, player, { card }) => card.checkHasBiscuit('k'),
  func(game, player, { card, owner, self }) {
    // 'player' = one taking action, 'owner' = karma card owner
    const drawn = game.actions.drawAndReveal(owner, card.getAge())
    if (drawn.checkHasBiscuit('k') || drawn.checkHasBiscuit('s')) {
      game.actions.meld(owner, drawn)
    } else {
      game.aSuperExecute(self, player, card)
    }
  }
}
```

**Alhazen** - Tuck and draw instead of draw action:
```javascript
{
  trigger: 'draw-action',
  kind: 'would-instead',
  matches: () => true,
  func: (game, player) => {
    const canTuck = game.cards.topsAll().filter(card => card.checkHasBiscuit('k'))
    game.actions.chooseAndTuck(player, canTuck)
    const ageChoices = game.util.colors()
      .map(color => game.zones.byPlayer(player, color))
      .flatMap(zone => {
        const biscuits = zone.biscuits()
        return [biscuits.s, biscuits.k]
      })
      .filter(age => age > 0)
    const uniqueChoices = util.array.distinct(ageChoices).sort((l, r) => l - r)
    const ageToDraw = game.actions.chooseAge(player, uniqueChoices)
    game.actions.draw(player, { age: ageToDraw })
  }
}
```

**Napoleon Bonaparte** - Tuck and score instead of score/return:
```javascript
{
  trigger: ['score', 'return'],
  kind: 'would-instead',
  matches: (game, player, { card }) => card.checkHasBiscuit('f'),
  func: (game, player, { card }) => {
    game.actions.tuck(player, card)
    const choices = game.cards.topsAll().filter(card => card.getAge() === 6)
    game.actions.chooseAndScore(player, choices)
  }
}
```

### Decree Triggers

```javascript
{
  trigger: 'decree-for-two',
  decree: 'Trade'  // or 'Advancement', 'War', etc.
}
```

### Conditional Matches

**Fu Xi** - Only on first action:
```javascript
{
  trigger: 'draw',
  kind: 'would-first',
  matches: (game, player, { age, self }) => {
    return game.state.actionNumber === 1 && age === game.getEffectAge(self, 1)
  },
  func(game, player, { self }) {
    game.actions.drawAndScore(player, game.getEffectAge(self, 2))
  }
}
```

**Augustus Caesar** - Only when dogmatizing card with {k}:
```javascript
{
  trigger: 'dogma',
  triggerAll: true,
  kind: 'would-instead',
  matches: (game, player, { card }) => card.checkHasBiscuit('k'),
  func(game, player, { card, owner, self }) {
    // Implementation
  }
}
```

## Testing Dogma Effects

### Simple Dogma with Choices

```javascript
test('dogma: choose a color', () => {
  const game = t.fixtureTopCard('Philosophy')
  t.setBoard(game, {
    dennis: {
      purple: ['Philosophy'],
      red: ['Construction', 'Industrialization'],
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Philosophy')
  t.choose(game, request, 'red')
  
  const red = game.zones.byPlayer(t.dennis(game), 'red')
  expect(red.splay).toBe('left')
})
```

### Optional Effects

```javascript
test('dogma: do not choose a color', () => {
  const game = t.fixtureTopCard('Philosophy')
  t.setBoard(game, {
    dennis: {
      purple: ['Philosophy'],
      red: ['Construction'],
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Philosophy')
  t.choose(game, request)  // Empty selection = skip optional
  
  const red = game.zones.byPlayer(t.dennis(game), 'red')
  expect(red.splay).toBe('none')
})
```

### Demand Effects (Affecting Opponents)

```javascript
test('dogma: demand effect transfers highest card', () => {
  const game = t.fixtureFirstPlayer()
  t.setBoard(game, {
    dennis: {
      red: ['Archery'],
      hand: [],
    },
    micah: {
      hand: ['Gunpowder', 'Currency'],
    },
    decks: {
      base: {
        1: ['Tools'],
      }
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Archery')
  
  t.testBoard(game, {
    dennis: {
      red: ['Archery'],
      hand: ['Gunpowder'],
    },
    micah: {
      hand: ['Currency', 'Tools'],
    }
  })
})
```

### Multiple Steps

```javascript
test('dogma: with splay', () => {
  const game = t.fixtureTopCard('Code of Laws')
  t.setBoard(game, {
    dennis: {
      purple: ['Code of Laws'],
      blue: ['Tools'],
      hand: ['Writing', 'Agriculture', 'Metalworking'],
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Code of Laws')
  request = t.choose(game, request, 'Writing')
  request = t.choose(game, request, 'blue')
  
  expect(t.cards(game, 'blue')).toEqual(['Tools', 'Writing'])
  expect(t.zone(game, 'blue').splay).toBe('left')
})
```

## Testing Karma Effects

Karma effects trigger on specific actions. Common triggers: `dogma`, `meld`, `tuck`, `junk`, `return`, `draw`, `achieve`.

**Important**: Karma only triggers for actions by the **owner** of the karma card, except with `triggerAll: true` (which triggers for all players but effect applies to owner).

### Testing Karma on Dogma

```javascript
test('karma', () => {
  const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
  t.setBoard(game, {
    dennis: {
      blue: ['Carl Friedrich Gauss'],
      score: ['The Wheel', 'Construction'],
      hand: ['Quantum Theory', 'Sailing', 'Enterprise'],
    },
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Meld.Quantum Theory')
  request = t.choose(game, request, 1)  // Choose age 1
  request = t.choose(game, request, 'Sailing')
  
  t.testBoard(game, {
    dennis: {
      green: ['The Wheel', 'Sailing'],
      blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
      score: ['Construction'],
      hand: ['Enterprise'],
    },
  })
})
```

### Testing `would-instead` Karma

```javascript
test('karma: junk from hand', () => {
  const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs', 'city'] })
  t.setBoard(game, {
    dennis: {
      yellow: ['Agriculture'],
      blue: ['Atlantis'],
      purple: ['Homer'],
      hand: ['Shennong'],
    },
    decks: {
      base: {
        2: ['Mathematics'],
      }
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Endorse.yellow')
  
  t.testIsSecondPlayer(game)
  t.testBoard(game, {
    dennis: {
      yellow: ['Agriculture', 'Shennong'],  // Tucked instead of junked
      blue: ['Mathematics'],
      purple: ['Homer'],
    },
  })
})
```

### Testing `would-first` Karma

```javascript
test('karma: effect age', () => {
  const game = t.fixtureTopCard('Archimedes', { expansions: ['base', 'figs'] })
  t.setBoard(game, {
    dennis: {
      green: ['The Wheel', 'Archimedes'],
    },
    decks: {
      base: {
        2: ['Calendar', 'Construction'],  // The Wheel draws {1}, karma increases to {2}
      }
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.The Wheel')
  
  expect(t.cards(game, 'hand').sort()).toStrictEqual(['Calendar', 'Construction'])
})
```

### Testing `triggerAll: true` Karma

For karma with `triggerAll: true`, test both owner and opponent actions:

```javascript
test('karma: opponent dogmas card with {k}', () => {
  const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
  t.setBoard(game, {
    dennis: {
      green: ['Augustus Caesar'],  // Owner of karma card
      hand: [],
    },
    micah: {
      red: ['Archery'],  // Has {k} biscuit
      hand: ['Gunpowder', 'Currency'],
    },
    achievements: ['The Wheel', 'Mathematics'],
    decks: {
      base: {
        1: ['Metalworking'],  // Drawn to dennis (owner), then melded
      }
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Archery')
  
  t.testBoard(game, {
    dennis: {
      green: ['Augustus Caesar'],
      red: ['Metalworking'],  // Melded to dennis (owner of karma card)
      hand: [],
    },
    micah: {
      red: ['Archery'],
      hand: ['Gunpowder', 'Currency'],
    },
    junk: [],
  })
})
```

## Testing Echo Effects

Echo effects trigger when you dogma the figure itself. Test like regular dogma:

```javascript
test('echo', () => {
  const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
  t.setBoard(game, {
    dennis: {
      blue: ['Carl Friedrich Gauss'],
    },
    decks: {
      base: {
        7: ['Lighting']
      }
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Carl Friedrich Gauss')
  
  t.testBoard(game, {
    dennis: {
      blue: ['Carl Friedrich Gauss'],
      hand: ['Lighting']
    },
  })
})
```

## Common Patterns

### Testing Achievements

**Important**: Don't test `achievements` zone directly (includes special achievements). Test `junk` zone instead.

**Figure Drawing**: When a player claims a standard achievement via "Achieve" action, opponents draw figures. If claimed via card effect, opponents do NOT draw figures.

**Setting Up Decks for Figure Drawing**: When achievements will be claimed via "Achieve" action, set up figure decks. The age must match the **achievement age**, not the figure's age:

```javascript
t.setBoard(game, {
  achievements: ['The Wheel', 'Machinery'],  // Age 1 and age 3
  decks: {
    base: {
      1: ['Tools'],  // For when age 1 achievement is claimed
      3: ['Engineering'],  // For when age 3 achievement is claimed
    },
    figs: {
      1: ['Fu Xi'],  // For when age 1 achievement is claimed
      3: ['Al-Kindi'],  // For when age 3 achievement is claimed
    }
  }
})
```

**Selecting Achievements**: Use `*base-1*` or `*echo-2*` patterns, but ensure unique selections (use different expansions):

```javascript
t.setBoard(game, {
  achievements: ['The Wheel', 'Heritage'],  // base age 1 and echo age 1 - unique
})
request = t.choose(game, request, 'Achieve.*base-1*')  // Always selects The Wheel
request = t.choose(game, request, 'Achieve.*echo-1*')  // Always selects Heritage
```

### Testing Decree Effects

```javascript
test('karma: decree', () => {
  t.testDecreeForTwo('Archimedes', 'Advancement')
})
```

### Testing Multiple Players

```javascript
test('dogma (two players to transfer)', () => {
  const game = t.fixtureFirstPlayer({ numPlayers: 3 })
  t.setBoard(game, {
    dennis: {
      red: ['Optics'],
      score: ['Reformation', 'The Wheel'],
    },
    // ... other players
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Optics')
  request = t.choose(game, request, 'micah')
  request = t.choose(game, request, 'The Wheel')
  
  // Assertions...
})
```

## Important Gotchas

1. **Top Card Requirement**: Only the **top card** (first in array) can be dogmatized. **CRITICAL**: If you need to dogma a card in your test, it MUST be the first card in its color array. For example, if you have `green: ['Alfred Nobel', 'Mapmaking']`, you can only dogma Alfred Nobel, NOT Mapmaking. To dogma Mapmaking, you must put it first: `green: ['Mapmaking', 'Alfred Nobel']`.
2. **Card Color Validation**: Cards must be in correct color piles
3. **Karma `owner` Parameter**: In karma with `triggerAll: true`, `owner` is karma card owner, `player` is action taker
4. **Auto-Ordering**: After melding/scoring multiple cards, may need `t.choose(game, request, 'auto')`
5. **Auto-Selection of Exact Counts**: When a player must choose a specific number of items and has exactly that many available, the system auto-selects them. However, you may still need to choose the order in which they are processed. Use `t.choose(game, request, 'auto')` for ordering when the order doesn't matter in the test.
6. **Artifact Actions**: Free artifact action at start of turn (handle if artifacts present)
7. **First Round**: Players only get one action in first round, not two
8. **Auto-Choosing**: Game auto-chooses when zero or one valid choice (no `t.choose()` needed)
9. **No Conditionals/Loops**: Tests must be explicit and deterministic - never use conditionals or loops on request selectors

## Common Mistakes to Avoid

1. ❌ Using `setHand`, `setColor`, etc. directly instead of `setBoard`
2. ❌ Forgetting `t.testIsSecondPlayer(game)` at end
3. ❌ Testing `achievements` zone directly instead of `junk`
4. ❌ Wrong card order after melding (cards go to front, not end)
5. ❌ Assuming opponents draw figures when achievements claimed via card effects
6. ❌ Not specifying required expansions
7. ❌ Using conditionals or loops on request selectors

## Best Practices

1. **Plan Before Implementing**: Before writing tests, plan which tests to write. Consider:
   - Happy path scenarios
   - Edge cases (empty zones, no valid targets, optional effects)
   - Different branches of conditional logic
   - All trigger conditions for karma effects
2. **Implement One Test at a Time**: Write and verify each test passes before moving to the next:
   - Write one test
   - Run it to ensure it passes
   - Fix any issues before proceeding
   - Only then write the next test
3. **Stop and Ask for Help**: If you find a test you can't get to work correctly after reasonable attempts, stop and ask for help rather than continuing with broken tests
4. **Test Happy Path First**: Start with most common scenario
5. **Test Edge Cases**: Empty hands/zones, no valid targets, optional effects skipped
6. **Use Descriptive Test Names**: `test('dogma: demand effect transfers highest card', () => {`
7. **Group Related Tests**: Use `describe` blocks
8. **Use `t.testBoard()`**: For complex states, use this instead of individual assertions
9. **Test Both Sides**: If conditional logic, test both branches
10. **Ensure Effects Complete**: Use `t.testIsSecondPlayer(game)` to verify completion
11. **Test with Correct Expansions**: Always specify `{ expansions: ['base', 'figs'] }`
12. **Never Use Conditionals/Loops**: Tests must be explicit and deterministic

## Running Tests

```bash
cd common
npm test -- <test-file-path>        # Run specific test
npm test -- ultimate/res/figs/       # Run all tests in directory
npm test                             # Run all tests
npm run test:watch                   # Watch mode
npm run test:coverage                # Coverage report
```
