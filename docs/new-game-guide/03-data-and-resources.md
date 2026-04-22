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
| One file per card | The default — works for any card pool. | Agricola: `major/`, `minorA/`, `occupationA/`. Dune: leader files in `res/leaders/`. |
| By card type | Pools >50 cards split per file naturally. | Agricola occupations grouped by deck. |
| By type **and** source | Hundreds of cards spanning multiple expansions. | Dune: `res/cards/imperium/<source>/<id>.js` (`base/`, `uprising/`, `bloodlines/`, …). |
| By category | Cards are homogeneous but numerous. | Twilight: `actionCards.js`, `agendaCards.js`. |
| Single file | Total cards <30 and unlikely to grow. | Tyrants: all cards in `cards/index.js`. |

**Default to one-file-per-card.** Bulk arrays (`const cards = [ {...}, {...}, ... ]`) become unmaintainable around ~50 entries: diffs are noisy, name collisions are invisible, and ability code drifts away from the card it belongs to. The leader migration in Dune demonstrated the win.

### File Naming and Lookup

- **Name files after the card's `id`, not its display `name`.** Many games legitimately reuse names (Dune's two `Sardaukar` cards, several `Skirmish` conflicts). The id is unique and stable, so it works as both a filename and an import key without disambiguation.
- **Always fetch cards by id.** Cards often appear in the deck multiple times (`count` field), and shared display names mean `findByName` returns ambiguous results. Build a `byId` index and require all consumers to go through it.
- **Aggregator stays array-typed** — the per-folder `index.js` re-exports the same arrays consumers used before (`imperiumCards`, `intrigueCards`, …) so the migration doesn't ripple into callers.

### Card Set Registration

Card sets allow game creation with configurable content. The factory passes selected sets to the game constructor:

```javascript
// In the factory
data.settings.cardSets = settings.cardSets || res.getCardSetIds()

// In initialize()
const cards = this.res.getCards(this.settings.cardSets)
cards.forEach(card => this.cards.register(new GameCard(this, card)))
```

### Compatibility / Source Filtering for Expansions

Games with expansions usually need to mix-and-match content per lobby. Use a two-axis filter — the card's `source` (which product it shipped in) and its `compatibility` (which game configurations the card works in):

```javascript
// res/index.js
const SOURCE_TO_SETTING = {
  'Base':       'useBaseGameCards',
  'Rise of Ix': 'useRiseOfIx',
  'Immortality':'useImmortality',
  'Bloodlines': 'useBloodlines',
  'Promo':      'usePromo',
}

function isSourceActive(source, settings) {
  if (source === 'Uprising') return true   // current edition, always on
  const key = SOURCE_TO_SETTING[source]
  return Boolean(key && settings[key])
}

function isIncluded(item, settings) {
  if (item.compatibility !== 'All' && item.compatibility !== 'Uprising') {
    return false
  }
  return isSourceActive(item.source, settings)
}
```

A card is included **only** if its compatibility names a configuration the game supports *and* its source has been opted into. Two common mistakes to avoid:

- Filtering on compatibility alone — `compatibility: 'All'` cards from later expansions leak into base games.
- Filtering on source alone — cards may ship in an expansion but only legally play in newer editions.

Add a settings flag for every source value, including promotional/preview cards (`usePromo`). Default new flags to `false`; default the current-edition flag to `true`.

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
