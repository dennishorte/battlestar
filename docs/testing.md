# Testing

## Frameworks

| Workspace | Framework | Config |
|-----------|-----------|--------|
| `api/` | Vitest 3.1 | `api/vitest.config.js` |
| `common/` | Jest 27.5 | Jest defaults |
| `app/` | Jest 29.7 | Minimal frontend tests |

## Running Tests

```bash
# API tests (Vitest)
npm run test -w api                  # Run once
npm run test:watch -w api            # Watch mode
npm run test:coverage -w api         # With coverage

# Common game logic tests (Jest)
npm run test -w common               # Run all
npm run test -w common -- --testPathPattern agricola   # Single game
npm run test -w common -- --testPathPattern "ultimate/res/base"  # Card tests

# Important: Use npm run test, NOT npx vitest
```

## API Tests (`api/tests/`)

### Configuration
- `vitest.config.js` - Node environment, V8 coverage, `#` alias → `./src`
- `vitest.setup.js` - Sets `NODE_ENV=test`, `SECRET_KEY=test-secret-key`

### Structure
```
tests/
├── unit/
│   ├── controllers/     Controller tests
│   ├── middleware/       Middleware tests (validation, auth, loaders)
│   ├── models/          Model tests
│   ├── services/        Service tests
│   ├── notifications/   Notification tests
│   └── utils/           Utility tests
├── integration/         API endpoint tests
└── mocks/               Test fixtures
```

### Pattern
```javascript
import { describe, it, expect, vi } from 'vitest'

describe('Feature', () => {
  it('should do something', () => {
    const mockFn = vi.fn()
    // test logic
    expect(result).toBe(expected)
  })
})
```

## Common Tests (`common/`)

### Core Framework Tests (`lib/`)
- `game.test.js` - Core game class tests (326 lines)
- `game/BaseActionManager.test.js` - Action manager
- `game/BaseLogManager.test.js` - Log manager
- `game/BasePlayerManager.test.js` - Player manager
- `game/BaseZone.test.js` - Zone tests
- `selector.test.js` - Input validation
- `jsonpath.test.js` - JSONPath queries

### Game Tests
Each game has `{game}.test.js` and `testutil.js` in its directory.

## Test Infrastructure

### GameTestFixture (`lib/game/testFixture.js`)

Fluent interface for game testing:

```javascript
const { createActionManagerFixture } = require('./testFixture.js')

const { fixture, actionManager, player1, game } = createActionManagerFixture({
  name: 'test_game',
  seed: 'test_seed',
  players: [
    { _id: 'p1', name: 'player1' },
    { _id: 'p2', name: 'player2' },
  ],
})

fixture.queueResponse(player1, ['option2'])
const result = actionManager.choose(player1, ['option1', 'option2'])
expect(result).toEqual(['option2'])
fixture.assertAllResponsesConsumed()
```

Key methods:
- `queueResponse(actor, selection)` / `queueResponses(responses)` - Queue player inputs
- `getPlayer(name)`, `getPlayer1()`, `getPlayer2()` - Get players
- `createMockCards(names)` - Create mock cards
- `assertAllResponsesConsumed()` - Verify all queued responses were used

### TestCommon (`lib/test_common.js`)

Shared helpers used by all game test utils:

| Method | Purpose |
|--------|---------|
| `choose(game, ...selections)` | Select from input request |
| `do(game, action)` | Perform action from "any" request |
| `testChoices(request, expected, min?, max?)` | Verify available choices |
| `testActionChoices(request, action, expected)` | Verify action choices |
| `testGameOver(request, playerName, reason)` | Verify game over |
| `testNotGameOver(request)` | Verify game continues |
| `dumpLog(game)` | Print game log |
| `dumpZones(root)` | Print zone structure |

### Game-Specific Test Utils

Each game extends TestCommon in its `testutil.js`:

**Agricola**: `gameFixture(state)`, `setPlayerState()`, `fixtureMinorImprovement()`, `fixtureOccupation()`
**Magic**: `fixture()`, `fixtureDecksSelected()`, `testBoard()`
**Tyrants**: `gameFixture(state)`, `setHand()`, `testTroops()`, `clearHands()`
**Ultimate**: `fixtureFirstPlayer()`, `setBoard()`, `setHand()`, `clearHands()`, `fixtureDecrees()`

### Breakpoint System

All games support test breakpoints for setup during initialization:

```javascript
game.testSetBreakpoint('after-init', (game) => {
  t.setHand(game, 'dennis', ['Card1', 'Card2'])
  t.clearHands(game, ['micah'])
})
```

## Common Test Patterns

### Game Flow Test
```javascript
test('player action produces expected result', () => {
  const game = t.gameFixture({
    dennis: { hand: ['Card'], power: 1 },
  })
  const request1 = game.run()
  const request2 = t.choose(game, 'Some Choice')
  t.testBoard(game, { dennis: { hand: [...], power: 0 } })
})
```

### Card Effect Test (Innovation)
```javascript
test('card dogma effect', () => {
  const game = t.fixtureFirstPlayer()
  t.setBoard(game, {
    dennis: { yellow: ['CardName'], hand: ['OtherCard'] },
  })
  let request = game.run()
  request = t.choose(game, 'Dogma.CardName')
  t.choose(game, 'OtherCard')
  expect(game.players.byName('dennis').score()).toBe(2)
})
```

### Mocking (Vitest)
```javascript
vi.mock('../../src/version', () => ({ default: '1.0.0' }))
const next = vi.fn()
```

### Mocking (Jest)
```javascript
jest.mock('../util.js', () => ({ shuffle: jest.fn(arr => arr) }))
jest.spyOn(obj, 'method')
```
