# How to Write Tests for Cards

This guide explains how to write tests for Innovation cards, including base cards, figures, achievements, and other card types.

## Table of Contents

1. [Running Tests](#running-tests)
2. [Test Structure](#test-structure)
3. [Test Utilities](#test-utilities)
4. [Setting Up Game State](#setting-up-game-state)
5. [Testing Dogma Effects](#testing-dogma-effects)
6. [Testing Karma Effects](#testing-karma-effects)
7. [Testing Echo Effects](#testing-echo-effects)
8. [Common Patterns](#common-patterns)
9. [Best Practices](#best-practices)

## Running Tests

Tests are run from the `common` directory using npm:

```bash
cd common
npm test -- <test-file-path>
```

### Examples

Run a specific test file:
```bash
npm test -- ultimate/res/figs/AugustusCaesar.test.js
```

Run all tests in a directory:
```bash
npm test -- ultimate/res/figs/
```

Run all tests:
```bash
npm test
```

### Watch Mode

To run tests in watch mode (automatically re-runs on file changes):
```bash
npm run test:watch
```

### Coverage

To generate a coverage report:
```bash
npm run test:coverage
```

## Test Structure

Every test file follows this basic structure:

```javascript
Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe('CardName', () => {
  test('test description', () => {
    // Test implementation
  })
})
```

The `Error.stackTraceLimit = 100` line ensures better error messages when tests fail.

## Test Utilities

The test utilities are available through `t` (imported from `testutil.js`). Key utilities include:

### Game Fixtures

- **`t.fixture(options)`** - Creates a basic game fixture with default players (dennis, micah, scott, eliya)
- **`t.fixtureFirstPlayer(options)`** - Creates a game and advances to the first player's turn
- **`t.fixtureTopCard(cardName, options)`** - Creates a game with the specified card as the top card of the current player
- **`t.fixtureDecrees(options)`** - Creates a game setup for testing decree effects

### Setting Game State

- **`t.setBoard(game, state)`** - Sets up the entire game board state (see [Setting Up Game State](#setting-up-game-state))
  - **This is the ONLY function you should use for initializing board state**
  - All other functions (`setHand`, `setColor`, `setScore`, etc.) are internal helpers and should not be called directly in tests

### Interacting with the Game

- **`t.choose(game, request, ...selections)`** - Makes a selection from an input request
- **`t.do(game, request, action)`** - Performs an action from an "any" input request
- **`game.run()`** - Runs the game until it needs input

### Asserting Game State

- **`t.testBoard(game, expectedState)`** - Asserts the entire game board matches expected state
- **`t.testZone(game, zoneName, expectedCards, opts)`** - Asserts a zone contains expected cards
- **`t.testIsSecondPlayer(game)`** - Asserts it's the second player's turn
- **`t.testChoices(request, expected, expectedMin, expectedMax)`** - Asserts available choices
- **`t.testActionChoices(request, action, expected)`** - Asserts choices for a specific action

### Helper Functions

- **`t.dennis(game)`** - Gets the dennis player object
- **`t.cards(game, zoneName, playerName)`** - Gets card names from a zone
- **`t.zone(game, zoneName, playerName)`** - Gets a zone object

## Setting Up Game State

**Important**: Always use `t.setBoard()` to initialize game state. Never use individual functions like `setHand`, `setColor`, `setScore`, etc. directly in your tests.

The `t.setBoard()` function is the **only** way to set up game state. It accepts an object describing the desired state:

```javascript
t.setBoard(game, {
  dennis: {
    red: ['Archery'],
    blue: ['Tools'],
    hand: ['Gunpowder', 'Currency'],
    score: ['The Wheel'],
    // For splayed piles:
    green: {
      cards: ['Agriculture', 'Domestication'],
      splay: 'left'
    }
  },
  micah: {
    hand: ['Mathematics'],
  },
  achievements: ['Machinery', 'Navigation'],  // Available achievements
  junk: ['Construction'],  // Cards in junk
  decks: {
    base: {
      1: ['Tools'],  // Top card of age 1 deck
      2: ['Mathematics', 'Construction'],  // Top cards (in order)
    }
  }
})
```

### Player Zones

For each player, you can set:
- Color piles: `red`, `yellow`, `green`, `blue`, `purple`
- `hand` - Cards in hand
- `score` - Cards in score pile
- `achievements` - Player's claimed achievements
- `artifact` - Artifacts (if using artifacts expansion)
- `forecast` - Forecast cards (if using forecast expansion)
- `safe` - Safe cards (if using safe expansion)
- `museum` - Museum cards (if using museum expansion)

### Color Piles with Splay

To set a splayed color pile:

```javascript
dennis: {
  blue: {
    cards: ['Tools', 'Writing'],
    splay: 'up'  // 'left', 'right', 'up', or 'none'
  }
}
```

Or simply as an array (defaults to no splay):

```javascript
dennis: {
  blue: ['Tools', 'Writing']
}
```

### Card Order in Color Piles

**Important**: The order of cards in color piles matters and depends on how they were added:

- **Melding** puts cards at the **front** (beginning) of the array
- **Tucking** puts cards at the **end** (back) of the array

When testing, make sure to reflect the correct order:

```javascript
// If Metalworking was melded to a pile with Archery:
red: ['Metalworking', 'Archery']  // Meld puts at front

// If Metalworking was tucked to a pile with Archery:
red: ['Archery', 'Metalworking']  // Tuck puts at end
```

### When to Use testSetBreakpoint

In most cases, `t.setBoard()` is sufficient for setting up game state. However, if you need to set up state after the game has started but before the first player's turn (for example, when using `fixtureTopCard` which sets up the card after initialization), you can use `testSetBreakpoint`. Even in this case, you should still use `setBoard` inside the breakpoint rather than individual functions:

```javascript
const game = t.fixtureTopCard('SomeCard')
game.testSetBreakpoint('before-first-player', (game) => {
  t.setBoard(game, {
    dennis: {
      red: ['SomeCard'],
      hand: ['OtherCard'],
    }
  })
})
```

However, in most cases, you can avoid `testSetBreakpoint` entirely by using `fixtureFirstPlayer` and `setBoard`:

```javascript
const game = t.fixtureFirstPlayer()
t.setBoard(game, {
  dennis: {
    red: ['SomeCard'],
    hand: ['OtherCard'],
  }
})
```

## Testing Dogma Effects

Dogma effects are the primary abilities of cards. Here are examples of different dogma patterns:

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

### Dogma with Optional Effects

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

### Dogma with Demands (Affecting Opponents)

```javascript
test('dogma: demand effect transfers highest card', () => {
  const game = t.fixtureFirstPlayer()
  t.setBoard(game, {
    dennis: {
      red: ['Archery'],
      hand: [],
    },
    micah: {
      hand: ['Gunpowder', 'Currency'], // Age 4 and Age 3
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

### Dogma with Conditional Logic

```javascript
test('red is not splayed up', () => {
  const game = t.fixtureTopCard('Flight')
  t.setBoard(game, {
    dennis: {
      red: ['Flight', 'Archery'],
      blue: ['Experimentation', 'Writing'],
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Flight')
  t.choose(game, request, 'red')
  
  const red = game.zones.byPlayer(t.dennis(game), 'red')
  expect(red.splay).toBe('up')
})
```

### Dogma with Loops

```javascript
test('dogma', () => {
  const game = t.fixtureTopCard('Metalworking')
  t.setBoard(game, {
    dennis: {
      red: ['Metalworking'],
      hand: [],
    },
    decks: {
      base: {
        1: ['Mysticism', 'Masonry', 'Clothing'],
      }
    }
  })
  
  let request
  request = game.run()
  t.choose(game, request, 'Dogma.Metalworking')
  
  const dennis = game.players.byName('dennis')
  const score = game.zones.byPlayer(dennis, 'score').cardlist().map(c => c.name).sort()
  const hand = game.zones.byPlayer(dennis, 'hand').cardlist().map(c => c.name).sort()
  expect(score).toEqual(['Masonry', 'Mysticism'])
  expect(hand).toEqual(['Clothing'])
})
```

### Dogma with Multiple Steps

```javascript
test('dogma, with splay', () => {
  const game = t.fixtureTopCard('Code of Laws')
  t.setBoard(game, {
    dennis: {
      purple: ['Code of Laws'],
      blue: ['Tools'],
      green: ['The Wheel'],
      red: ['Archery'],
      hand: ['Writing', 'Agriculture', 'Metalworking'],
    }
  })
  
  const result1 = game.run()
  const result2 = t.choose(game, result1, 'Dogma.Code of Laws')
  
  expect(result2.selectors[0].choices.sort()).toEqual(['Metalworking', 'Writing'])
  
  const result3 = t.choose(game, result2, 'Writing')
  expect(result3.selectors[0].choices.sort()).toEqual(['blue'])
  
  const result4 = t.choose(game, result3, 'blue')
  
  expect(t.cards(game, 'blue')).toEqual(['Tools', 'Writing'])
  expect(t.zone(game, 'blue').splay).toBe('left')
})
```

### Testing Edge Cases

Always test edge cases:

```javascript
test('dogma: demand effect with no transferable cards', () => {
  const game = t.fixtureFirstPlayer()
  t.setBoard(game, {
    dennis: {
      red: ['Archery'],
      hand: [],
    },
    micah: {
      hand: [],
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
      hand: ['Tools'],
    },
    micah: {
      hand: [],
    }
  })
})
```

## Testing Karma Effects

Karma effects are special abilities on figure cards that trigger under certain conditions. Common karma triggers include:
- `dogma` - When a card is dogmatized
- `meld` - When a card is melded
- `when-meld` - When this specific card is melded
- `tuck` - When a card is tucked
- `junk` - When a card is junked
- `return` - When a card is returned

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

### Testing Karma with would-instead

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

### Testing Karma with would-first

```javascript
test('karma: effect age', () => {
  const game = t.fixtureTopCard('Archimedes', { expansions: ['base', 'figs'] })
  t.setBoard(game, {
    dennis: {
      green: ['The Wheel', 'Archimedes'],
    },
    decks: {
      base: {
        2: ['Calendar', 'Construction'],
      }
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.The Wheel')
  
  expect(t.cards(game, 'hand').sort()).toStrictEqual(['Calendar', 'Construction'])
})
```

### Testing Karma with when-meld

```javascript
test('karma: when meld', () => {
  const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
  t.setBoard(game, {
    dennis: {
      hand: ['Peter the Great'],
    },
    micah: {
      green: ['Shennong'],
      blue: ['Archimedes'],
    }
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Meld.Peter the Great')
  
  // Opponents' top figures should be returned
  t.testBoard(game, {
    dennis: {
      red: ['Peter the Great'],
    },
    micah: {
      green: [],
      blue: [],
    }
  })
})
```

## Testing Echo Effects

Echo effects are special abilities on figure cards that trigger when you dogma the figure itself. They're tested like regular dogma effects:

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
  request = t.choose(game, request, 'micah')  // Choose target player
  request = t.choose(game, request, 'The Wheel')
  
  // Assertions...
})
```

### Testing Achievements

**Important**: You cannot test the `achievements` zone directly in `t.testBoard()` because it includes all special achievements that are always present. Instead, test the `junk` zone to verify whether achievements were junked.

**Note on Figure Drawing**: When a player claims a standard achievement using the "Achieve" action, opponents draw figures. However, if an achievement is claimed via a card effect (such as Masonry's dogma or other karma effects), opponents do **not** draw figures. Only the "Achieve" action triggers figure drawing for opponents.

```javascript
test('dogma: junking age 1 achievement', () => {
  const game = t.fixtureFirstPlayer()
  t.setBoard(game, {
    dennis: {
      red: ['Archery'],
      hand: [],
    },
    achievements: ['The Wheel', 'Mathematics', 'Machinery', 'Navigation'],
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Archery')
  request = t.choose(game, request, '**base-1*')  // Select achievement by ID pattern
  
  // Test that the achievement was junked
  t.testBoard(game, {
    dennis: {
      red: ['Archery'],
      hand: [],
    },
    junk: ['The Wheel'], // Achievement was junked
  })
  
  // Or use direct assertions for more specific checks
  expect(game.getAvailableAchievementsByAge(t.dennis(game), 1)).toHaveLength(0)
  expect(game.getAvailableAchievementsByAge(t.dennis(game), 2)).toHaveLength(1)
})
```

To verify that **no achievement was junked**, test that the junk is empty:

```javascript
test('karma: no achievement was junked', () => {
  const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
  t.setBoard(game, {
    dennis: {
      green: ['Augustus Caesar'],
      red: ['Archery'],
      hand: [],
    },
    achievements: ['The Wheel', 'Mathematics'],
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Archery')
  
  t.testBoard(game, {
    dennis: {
      green: ['Augustus Caesar'],
      red: ['Archery', 'Metalworking'],
      hand: [],
    },
    junk: [], // No achievement was junked (Archery dogma did not execute)
  })
})
```

### Testing Special Achievements

```javascript
test('dogma: send to junk', () => {
  const game = t.fixtureFirstPlayer()
  t.setBoard(game, {
    dennis: {
      blue: ['Publications', 'Tools'],
      green: ['Sailing', 'Navigation', 'Databases', 'The Wheel'],
    },
  })
  
  let request
  request = game.run()
  request = t.choose(game, request, 'Dogma.Publications')
  request = t.choose(game, request, 'blue')
  request = t.choose(game, request, 'Monument')
  
  t.testIsSecondPlayer(game)
  t.testBoard(game, {
    dennis: {
      blue: {
        cards: ['Publications', 'Tools'],
        splay: 'up',
      },
      green: ['Sailing', 'Navigation', 'Databases', 'The Wheel'],
    },
    junk: ['Monument']
  })
})
```

### Testing Decree Effects

```javascript
test('karma: decree', () => {
  t.testDecreeForTwo('Archimedes', 'Advancement')
})
```

The `testDecreeForTwo` helper tests that when a figure is the top card, it produces the expected decree.

## Best Practices

1. **Test the Happy Path First**: Start with the most common, straightforward scenario.

2. **Test Edge Cases**: Always test:
   - Empty hands/zones
   - No valid targets
   - Maximum/minimum values
   - Optional effects when skipped

3. **Use Descriptive Test Names**: Test names should clearly describe what's being tested:
   ```javascript
   test('dogma: demand effect transfers highest card', () => {
   ```

4. **Group Related Tests**: Use `describe` blocks to group related tests:
   ```javascript
   describe('You may splay left any one color of your cards.', () => {
     test('choose a color', () => { ... })
     test('do not choose a color', () => { ... })
   })
   ```

5. **Use `t.testBoard()` for Complex States**: When testing multiple zones or players, use `t.testBoard()` rather than individual assertions.

6. **Test Both Sides of Conditionals**: If a card has conditional logic (e.g., "if X, then Y, else Z"), test both branches.

7. **Test Interactions**: When testing karma effects, make sure to test:
   - The karma triggering correctly
   - The karma not triggering when it shouldn't
   - Interactions with other cards

8. **Ensure Effects Complete**: Always verify that effects have fully executed by checking the turn state at the end of your test. Use `t.testIsSecondPlayer(game)` or `t.testIsFirstAction(request)` to ensure the effect completed and the game advanced properly:
   ```javascript
   let request
   request = game.run()
   request = t.choose(game, request, 'Dogma.SomeCard')
   request = t.choose(game, request, 'someChoice')
   request = t.choose(game, request, 'auto') // If needed for ordering
   
   t.testIsSecondPlayer(game) // Ensures the effect completed
   t.testBoard(game, {
     // ... expected state
   })
   ```
   **Exception**: Only omit this check if you specifically want to test an incomplete effect or are testing an intermediate state.

9. **Use `setBoard` for All Initial State**: Always use `t.setBoard()` to set up initial game state. The `testSetBreakpoint` approach is rarely needed - most setup can be done with `setBoard`:
   ```javascript
   t.setBoard(game, {
     dennis: {
       red: ['Construction'],
     }
   })
   ```
   If you do need `testSetBreakpoint`, still use `setBoard` inside it rather than individual functions.

10. **Check Request States**: When testing multi-step interactions, verify intermediate request states:
   ```javascript
   const result2 = t.choose(game, result1, 'Dogma.Code of Laws')
   expect(result2.selectors[0].choices.sort()).toEqual(['Metalworking', 'Writing'])
   ```

11. **Test with Correct Expansions**: Always specify the required expansions:
    ```javascript
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    ```

## Example: Complete Test File

Here's a complete example combining multiple patterns:

```javascript
Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe('Philosophy', () => {

  describe('You may splay left any one color of your cards.', () => {
    test('choose a color', () => {
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

    test('do not choose a color', () => {
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
      t.choose(game, request)

      const red = game.zones.byPlayer(t.dennis(game), 'red')
      expect(red.splay).toBe('none')
    })
  })

  describe('You may score a card from your hand', () => {
    test('return a card', () => {
      const game = t.fixtureTopCard('Philosophy')
      t.setBoard(game, {
        dennis: {
          purple: ['Philosophy'],
          hand: ['Construction', 'Industrialization'],
        }
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      t.choose(game, request, 'Industrialization')

      const score = game.zones.byPlayer(t.dennis(game), 'score').cardlist().map(c => c.name)
      expect(score).toEqual(['Industrialization'])
    })

    test('do not return a card', () => {
      const game = t.fixtureTopCard('Philosophy')
      t.setBoard(game, {
        dennis: {
          purple: ['Philosophy'],
          hand: ['Construction', 'Industrialization'],
        }
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      t.choose(game, request)

      const score = game.zones.byPlayer(t.dennis(game), 'score').cardlist().map(c => c.name)
      expect(score).toEqual([])
    })
  })
})
```

This example demonstrates:
- Grouping related tests with `describe`
- Testing optional effects (both choosing and skipping)
- Using `setBoard` for all initial state setup
- Testing both dogma effects of a card
- Clear, descriptive test names

