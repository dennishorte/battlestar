# 3. Data and Resources

Game data -- card definitions, board layouts, constants, scoring tables -- lives in the `res/` directory. This section covers how to organize it and how the factory pattern wires everything together.

---

## The res/ Directory

Every game has a `res/` directory with an `index.js` that aggregates and re-exports all game data:

```
common/<game>/res/
├── index.js           Aggregator: imports everything, exports a unified API
├── cards/             Card definitions (organized by set, type, or expansion)
│   ├── index.js       Card aggregator
│   ├── setA/          One directory per card set
│   │   ├── index.js
│   │   ├── Card1.js
│   │   └── Card2.js
│   └── setB/
├── constants.js       Game constants (board dimensions, max rounds, etc.)
├── scoringTables.js   Scoring rules and point tables
└── boardLayout.js     Board geometry, tile definitions, etc.
```

### The Aggregator Pattern

`res/index.js` is the single entry point for all game data. It should export a clean API:

```javascript
const cards = require('./cards')
const constants = require('./constants')
const scoringTables = require('./scoringTables')

module.exports = {
  getCards(cardSets) {
    return cardSets.flatMap(set => cards[set] || [])
  },
  getCardSetIds() {
    return Object.keys(cards)
  },
  constants,
  scoringTables,
}
```

Games should never import from `res/` subdirectories directly -- always go through `res/index.js`. This keeps the data layer swappable and testable.

---

## Card Definitions

Card definitions are plain objects with an `id`, a display `name`, and whatever hooks or static data the game needs. The exact shape depends on the game, but here's the common pattern:

```javascript
module.exports = {
  id: 'wall-builder-a111',
  name: 'Wall Builder',
  type: 'occupation',
  set: 'occupationA',

  // Static data
  cost: { food: 1 },
  prereqs: { occupations: 2 },
  vps: 0,

  // Hooks (called by the game engine)
  onPlay(game, player) {
    player.incrementCounter('stone', 2)
  },

  getEndGamePoints(game, player) {
    return player.getCounter('stone') >= 5 ? 3 : 0
  },
}
```

### Organization Strategies

| Strategy | When to use | Example |
|----------|-------------|---------|
| By card type | Cards have distinct types with different hooks | Agricola: `major/`, `minorA/`, `occupationA/` |
| By expansion | Expansions add cards of all types | Card sets A, B, C, etc. |
| By category | Cards are homogeneous but numerous | Twilight: `actionCards.js`, `agendaCards.js` |
| Single file | Few total cards | Tyrants: all cards in `cards/index.js` |

### Card Set Registration

Card sets allow game creation with configurable content. The factory passes selected sets to the game constructor:

```javascript
// In the factory
data.settings.cardSets = settings.cardSets || res.getCardSetIds()

// In initialize()
const cards = this.res.getCards(this.settings.cardSets)
cards.forEach(card => this.cards.register(new GameCard(this, card)))
```

### Test Cards

Create a `test` card set with no-effect cards for satisfying prerequisites in tests:

```javascript
// res/cards/test/index.js
module.exports = Array.from({ length: 8 }, (_, i) => ({
  id: `test-occupation-${i + 1}`,
  name: `Test Occupation ${i + 1}`,
  type: 'occupation',
  set: 'test',
}))
```

These are included in test fixtures by default and referenced in `setBoard` to satisfy prereqs without side effects.

---

## The Factory Pattern

Every game exports three things: the game constructor, a factory function, and a lobby-to-factory adapter.

### GameFactory

Creates a game instance from raw settings:

```javascript
const { GameFactory: BaseFactory } = require('../../lib/game')

function MyGameFactory(settings, viewerName) {
  const data = BaseFactory(settings)

  // Game-specific settings with defaults
  data.settings.numPlayers = settings.numPlayers || 2
  data.settings.cardSets = settings.cardSets || res.getCardSetIds()
  data.settings.useExpansion = settings.useExpansion || false

  return new MyGame(data, viewerName)
}
```

### factoryFromLobby

Adapts the lobby object (from the API) to factory settings:

```javascript
function factoryFromLobby(lobby) {
  return MyGameFactory({
    game: 'My Game',
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,
    numPlayers: lobby.users.length,
    ...lobby.options,
  })
}
```

### Exports

```javascript
module.exports = {
  Game: MyGame,
  GameFactory: MyGameFactory,
  factory: factoryFromLobby,
  res,
}
```

The `factory` export is what the API uses to create new games from lobby data.

---

## Game Registration

To make the API and frontend aware of a new game:

1. **API**: Add the game to the game registry (`api/src/services/games.js` or equivalent) so the lobby can create instances.
2. **Frontend**: Add a route and component in `app/src/modules/games/<game>/`.
3. **Common index**: Export the game from `common/index.js` if it uses a shared entry point.

The exact registration steps depend on the current state of the routing code -- check how existing games are registered and follow the same pattern.

---

## References

- **Agricola res/**: `common/agricola/res/` (254-line index.js, modular card sets)
- **Twilight res/**: `common/twilight/res/` (31-line index.js, category-based files)
- **Factory pattern**: [common/docs/game-engine-overview.md](../../common/docs/game-engine-overview.md#factory-pattern)
