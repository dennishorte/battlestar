# How to Write Tests for Cards

This guide explains how to write tests for Innovation cards, optimized for LLM usage.

## Quick Start: Complete Example

```javascript
Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe('Philosophy', () => {
  test('dogma: choose a color', () => {
    const game = t.fixtureFirstPlayer()
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

    t.testBoard(game, {
      dennis: {
        purple: ['Philosophy'],
        red: {
          cards: ['Construction', 'Industrialization'],
          splay: 'left',
        },
      }
    })
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
- **`t.fixture(options)`** - Basic game fixture
- **`t.setBoard(game, state)`** - **ONLY way to set up game state** (see below)

### Game Interaction
- **`t.choose(game, request, ...selections)`** - Makes selections (auto-advances game)
- **`game.run()`** - Run game until input needed (call once at start)

### Assertions
- **`t.testBoard(game, expectedState)`** - **Always use this** for state assertions (includes `junk` zone)
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
  junk: ['Construction'],  // Test junk contents directly in testBoard
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
- **CRITICAL: Only top card (first in array) can be dogmatized and only top card karmas trigger** - If you need to dogma a card, it MUST be the first card in its color array.
- **Junk contents**: Test directly in `testBoard` using `junk: ['CardName']` - no need for separate `expect` statements

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
- **Globalization** (yellow, age 10) - Demand with multiple effects (see H.G. Wells tests)

### Draw Actions
- **The Wheel** (green, age 1) - "Draw two {1}" - Very common
- **Writing** (blue, age 1) - "Draw a {2}"
- **Calendar** (green, age 2), **Engineering** (red, age 3), **Experimentation** (blue, age 4)
- **Measurement** (blue, age 5), **Industrialization** (yellow, age 6)
- **Lighting** (green, age 7), **Explosives** (red, age 7)
- **Skyscrapers** (yellow, age 8), **Rocketry** (red, age 8)
- **Services** (yellow, age 9), **Suburbia** (green, age 9), **Specialization** (blue, age 9)
- **Databases** (blue, age 10), **A.I.** (blue, age 10) - Simple effects for testing

### Splay Actions
- **Philosophy** (purple, age 2) - "You may splay left any one color"
- **Code of Laws** (purple, age 1) - Tuck then splay
- **Paper** (blue, age 4)

### Cards with Specific Biscuits
- **{k}**: Archery (red, 1), Metalworking (red, 1), Road Building (red, 2)
- **{s}**: Tools (blue, 1), Writing (blue, 1), Mathematics (blue, 2)
- **{c}**: Optics (red, 3), Translation (blue, 3), Skyscrapers (yellow, 8)
- **{f}**: Corporations (green, 6), Fermenting (yellow, 2)
- **{l}**: Agriculture (yellow, 1), Sailing (green, 1), Fermenting (yellow, 2)
- **{i}**: Software (blue, 10), Databases (green, 10)

### Achievement Cards
- **The Wheel** (green, age 1), **Mathematics** (blue, age 2), **Machinery** (red, age 3)
- **Navigation** (green, age 4), **Reformation** (purple, age 5)

### Figure Cards for Testing
- **Age 1**: Fu Xi (decree + draw karma), Homer (junk/return karma), Shennong (draw karma)
- **Age 2**: Archimedes (decree + effect age karma), Augustus Caesar (dogma {k} karma)
- **Age 3**: Al-Kindi, Alhazen (draw-action karma)
- **Age 5**: Peter the Great (decree + return karma), Antonie Van Leeuwenhoek (draw + achieve karma), Johannes Vermeer (meld + achieve karma)
- **Age 6**: Carl Friedrich Gauss (meld karma), Napoleon Bonaparte (decree + score/return karma), Shivaji (achieve + dogma karma)
- **Age 8**: Albert Einstein (meldMany karma), H.G. Wells (super-execute karma)

## Reference: Karma Implementation Patterns

See test files for complete examples:
- **`would-first`**: Archimedes, Carl Friedrich Gauss, Peter the Great, Johannes Vermeer, Antonie Van Leeuwenhoek, Shivaji, John Von Neumann, Caresse Crosby, Nikola Tesla, J.P. Morgan, Emmy Noether, Marie Curie, Albert Einstein
- **`would-instead`**: Homer, Augustus Caesar, Alhazen, Napoleon Bonaparte, Emperor Meiji, Erwin Rommel, John Von Neumann, H.G. Wells
- **`triggerAll: true`**: Augustus Caesar, Caresse Crosby, J.P. Morgan, Emmy Noether
- **`list-hand`**: Emperor Meiji
- **`extra-achievements`**: Marie Curie
- **`calculate-score`**: Emmy Noether
- **`decree-for-two`**: Archimedes, Augustus Caesar, Peter the Great, Napoleon Bonaparte, Nikola Tesla, J.P. Morgan, Albert Einstein, H.G. Wells

## Testing Dogma Effects

### Simple Dogma with Choices
See **Philosophy** tests for choosing colors.

### Optional Effects
See **Philosophy** tests for skipping optional effects.

### Demand Effects (Affecting Opponents)
See **Archery** tests for demand effects. When testing super-execute vs self-execute, use cards with demand effects (e.g., **Globalization**, **Databases**, **A.I.**) to verify opponents are demanded.

### Multiple Steps
See **Code of Laws** tests for multi-step dogma effects. **Important**: Cards with multiple dogma effects (like **Globalization**) require handling all effects in sequence.

## Testing Karma Effects

Karma effects trigger on specific actions. Common triggers: `dogma`, `meld`, `tuck`, `junk`, `return`, `draw`, `achieve`.

**Important**: Karma only triggers for actions by the **owner** of the karma card, except with `triggerAll: true` (which triggers for all players but effect applies to owner).

### Testing Karma on Dogma
See **Carl Friedrich Gauss** tests for meld karma.

### Testing `would-instead` Karma
See **Homer** tests for junk/return karma, **Emperor Meiji** for meld karma with win condition, **Erwin Rommel** for score karma, **H.G. Wells** for dogma karma with super-execute.

### Testing `would-first` Karma
See **Archimedes** tests for effect age karma, **John Von Neumann** for meld + self-execute, **Caresse Crosby** for dogma karma with triggerAll, **Nikola Tesla** for meld karma, **J.P. Morgan** for dogma karma with triggerAll, **Emmy Noether** for score karma with triggerAll, **Marie Curie** for draw karma, **Albert Einstein** for draw-action karma with meldMany.

### Testing `triggerAll: true` Karma
See **Augustus Caesar**, **Caresse Crosby**, **J.P. Morgan**, **Emmy Noether** tests. For karma that affects opponents, simplify by putting the karma card on the opponent's board and having the owner perform the action.

## Common Testing Patterns Learned

### Stack Behavior (Color Stacks)
Color stacks work like computer science stacks: **first card melded goes to bottom, last card melded goes to top (index 0)**. See **Albert Einstein** tests for examples of explicit melding order.

```javascript
// When melding multiple cards, select them in reverse order of desired stack position
// First selected = bottom of stack, last selected/auto = top of stack (index 0)
request = t.choose(game, request, 'Tools')      // Goes to bottom
request = t.choose(game, request, 'Mathematics') // Goes in middle
// Writing is auto-selected as last = goes to top (index 0)
// Result: ['Writing', 'Mathematics', 'Tools'] (top to bottom)
```

### Testing Karma with `triggerAll: true`
When testing karma that affects opponents, simplify by putting the karma card on the opponent's board:

```javascript
// ✅ Simple: Put karma on opponent's board, owner does action
test('karma: opponent scores card', () => {
  const game = t.fixtureFirstPlayer()
  t.setBoard(game, {
    dennis: {
      purple: ['Philosophy'], // Owner does action
      hand: ['Tools'],
    },
    micah: {
      green: ['Emmy Noether'], // Karma on opponent's board
    },
  })
  // ... simple, direct test
})
```

### Setting Up Decks for Deterministic Draws
Always specify cards that will be drawn in the `decks` section:

```javascript
t.setBoard(game, {
  dennis: {
    blue: ['Writing'], // Draws age 2
  },
  decks: {
    base: {
      2: ['Mathematics'], // Ensures Mathematics is drawn
    },
  },
})
```

### Handling Action Return Values
Some actions return arrays. Always check the return type:

```javascript
// chooseAndScore returns an array
const scoredCards = game.actions.chooseAndScore(player, choices)
if (scoredCards && scoredCards.length > 0) {
  const scoredCard = scoredCards[0] // Access first element
}
```

### Verifying Card Properties
Before using cards in filters, verify their properties:

```javascript
// ❌ Wrong: Assuming Archery doesn't have 's'
const choices = cards.filter(card => !card.checkHasBiscuit('s'))
// Archery has biscuits 'kshk' which includes 's'!

// ✅ Correct: Check first
read_file('common/ultimate/res/base/Archery.js')
// Then use appropriate cards like Oars (biscuits 'kchk', no 's')
```

### First Player Action Count
Remember: The first player only gets one action:

```javascript
// ❌ Wrong: Two actions for first player
request = t.choose(game, request, 'Draw.draw a card')
request = t.choose(game, request, 'Draw.draw a card') // This won't work!

// ✅ Correct: One action for first player
request = t.choose(game, request, 'Draw.draw a card')
// Now it's the second player's turn
```

### MeldMany with Explicit Ordering
When using `meldMany` with multiple cards, you only need to explicitly select all but one - the last card is auto-selected. Select cards in reverse order of desired stack position (first selected = bottom, last/auto = top). See **Albert Einstein** tests.

### Testing Super-Execute vs Self-Execute
To verify super-execute (demands all opponents) vs self-execute (only affects owner), use cards with demand effects. See **H.G. Wells** tests for examples using **Globalization** and **A.I.**.

### Testing Cards with Multiple Effects
When a card has multiple dogma effects (e.g., **Globalization**), all effects execute in sequence. Ensure your test handles all effects. See **H.G. Wells** tests.

## Testing Echo Effects

Echo effects trigger when you dogma the figure itself. Test like regular dogma. See **Carl Friedrich Gauss** tests.

## Common Patterns

### Testing Achievements

**Important**: Don't test `achievements` zone directly (includes special achievements). Test `junk` zone instead using `testBoard`.

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

See **Optics** tests for examples with multiple players.

## Important Gotchas

1. **Top Card Requirement**: Only the **top card** (first in array) can be dogmatized. **CRITICAL**: If you need to dogma a card in your test, it MUST be the first card in its color array.
2. **Card Color Validation**: Cards must be in correct color piles
3. **Karma `owner` Parameter**: In karma with `triggerAll: true`, `owner` is karma card owner, `player` is action taker
4. **Stack Behavior**: Color stacks work like CS stacks - first melded at bottom, last melded at top (index 0). When melding multiple cards, select in reverse order of desired position.
5. **Auto-Selection of Exact Counts**: When a player must choose a specific number of items and has exactly that many available, the system auto-selects them. However, you may still need to choose the order in which they are processed. Use `t.choose(game, request, 'auto')` for ordering when the order doesn't matter in the test.
6. **MeldMany Ordering**: When using `meldMany` with multiple cards, only select all but one explicitly - the last is auto-selected. Select in reverse order of desired stack position.
7. **Artifact Actions**: Free artifact action at start of turn (handle if artifacts present)
8. **First Player Action Count**: **CRITICAL**: The first player to act only gets **one action**, not two. This applies to the very first player in the game. After the first round, players get two actions per turn.
9. **Auto-Choosing**: Game auto-chooses when zero or one valid choice (no `t.choose()` needed)
10. **No Conditionals/Loops**: Tests must be explicit and deterministic - never use conditionals or loops on request selectors
11. **Deterministic Draws**: When drawing cards in tests, **always set up decks in `setBoard`** so draws are deterministic.
12. **Action Return Values**: Some actions return arrays, not single values. For example, `game.actions.chooseAndScore()` returns an array of cards. Access the first element if you need a single card: `const scoredCard = scoredCards[0]`.
13. **Card Biscuit Verification**: When filtering cards by biscuits (e.g., cards without `s` or `i`), **double-check the actual biscuits** on the cards you're using. Use `read_file` to verify card biscuits before using them in tests.
14. **Simplifying Test Setup**: Instead of complex turn management (e.g., having one player draw cards to advance to another player's turn), simplify by putting the karma card on the opponent's board and having the owner perform the action.
15. **Junk Contents**: Test junk contents directly in `testBoard` using `junk: ['CardName']` - no need for separate `expect` statements.
16. **Multiple Card Effects**: When a card has multiple dogma effects, all effects execute in sequence. Ensure your test handles all effects.
17. **Super-Execute Parameters**: `game.actions.superExecute(executingCard, player, card)` - the first parameter is the card executing the super-execute, not the player.

## Common Mistakes to Avoid

1. ❌ Using `setHand`, `setColor`, etc. directly instead of `setBoard`
2. ❌ Forgetting `t.testIsSecondPlayer(game)` at end
3. ❌ Testing `achievements` zone directly instead of `junk` in `testBoard`
4. ❌ Wrong card order after melding (cards go to front, not end)
5. ❌ Assuming opponents draw figures when achievements claimed via card effects
6. ❌ Not specifying required expansions
7. ❌ Using conditionals or loops on request selectors
8. ❌ Giving the first player two actions (they only get one)
9. ❌ Drawing cards without setting up decks in `setBoard` (makes tests non-deterministic)
10. ❌ Assuming action methods return single values when they return arrays
11. ❌ Using cards with wrong biscuits without verifying (e.g., using Archery when filtering out cards with `s`)
12. ❌ Overcomplicating tests with unnecessary turn management instead of simplifying setup
13. ❌ Incorrect stack ordering when melding multiple cards (remember: first selected = bottom, last/auto = top)
14. ❌ Using separate `expect` statements for junk instead of testing in `testBoard`
15. ❌ Not handling all effects when testing cards with multiple dogma effects

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
8. **Use `t.testBoard()`**: For complex states, use this instead of individual assertions (includes `junk` zone)
9. **Test Both Sides**: If conditional logic, test both branches
10. **Ensure Effects Complete**: Use `t.testIsSecondPlayer(game)` to verify completion
11. **Test with Correct Expansions**: Always specify `{ expansions: ['base', 'figs'] }`
12. **Never Use Conditionals/Loops**: Tests must be explicit and deterministic
13. **Set Up Decks for All Draws**: Always specify cards in `decks` that will be drawn to ensure deterministic behavior
14. **Verify Card Properties**: When filtering by biscuits or other properties, verify the actual card properties using `read_file` before using them in tests
15. **Simplify Test Setup**: Prefer simple, direct setups over complex turn management. For karma tests, consider putting the karma card on the opponent's board and having the owner perform the action.
16. **Check Return Types**: When using action methods, check whether they return single values or arrays, and handle accordingly
17. **Test Junk in testBoard**: Use `junk: ['CardName']` in `testBoard` instead of separate `expect` statements
18. **Handle All Effects**: When testing cards with multiple dogma effects, ensure all effects are handled in sequence

## Running Tests

```bash
cd common
npm test -- <test-file-path>        # Run specific test
npm test -- ultimate/res/figs/       # Run all tests in directory
npm test                             # Run all tests
npm run test:watch                   # Watch mode
npm run test:coverage                # Coverage report
```
