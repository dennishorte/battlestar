# Base Classes

This document covers the base classes that every game builds on. All base classes live in `common/lib/game/` and use the [GameProxy pattern](./game-engine-overview.md#the-gameproxy-pattern) for transparent access to `this.log`, `this.actions`, `this.cards`, `this.players`, `this.zones`, and `this.state`.

---

## BasePlayer

Players represent participants in the game. Each player is created from user data and tracked by the PlayerManager.

### Constructor

```javascript
class BasePlayer {
  constructor(game, data) {
    this.game = game
    this._id = data._id
    this.id = data.name        // Used as the primary identifier
    this.name = data.name
    this.team = data.team || data.name
    this.seatNumber = undefined // Set by PlayerManager after seating
    this.eliminated = false
    this.counters = {}
    return GameProxy.create(this)
  }
}
```

### Counter System

Players have a generic counter system for tracking numeric values (score, resources, etc.):

| Method | Description |
|--------|-------------|
| `addCounter(name, count=0)` | Initialize a new counter with a starting value |
| `getCounter(name)` | Get current value (returns 0 if not set) |
| `setCounter(name, value, opts)` | Set to an absolute value |
| `incrementCounter(name, count=1, opts)` | Add to current value (negative to subtract) |
| `decrementCounter(name, count=1)` | Subtract from current value |

All mutations log the change automatically unless `opts.silent` is true:

```javascript
player.addCounter('score', 0)
player.incrementCounter('score', 5)
// Log: "dennis 'score': 0 + 5 = 5"
```

### Other Methods

| Method | Description |
|--------|-------------|
| `isCurrentPlayer()` | Whether this player is the current active player |
| `isOpponent(other)` | Whether another player is on a different team |
| `BasePlayer.isActive(player)` | Static method; returns `!player.eliminated` |

---

## BaseCard

Cards are game objects that live in zones and can move between them. Each card has an `id`, an `owner`, a `home` zone, and a current `zone`.

### Constructor

```javascript
class BaseCard {
  constructor(game, data) {
    this.game = game
    this.data = data
    this.id = data.id || null
    this.owner = null
    this.home = null    // Zone where the card returns to
    this.zone = null    // Zone where the card currently is
    this.visibility = [] // Array of players who can see this card
    return GameProxy.create(this)
  }
}
```

### Movement

| Method | Description |
|--------|-------------|
| `moveTo(zone, index=null)` | Move to a zone at a specific position (null = bottom) |
| `moveToTop(zone)` | Move to position 0 in the zone |
| `moveHome()` | Move back to the home zone |

Movement calls two hooks that subclasses can override:

- `_beforeMoveTo(newZone, newIndex, oldZone, oldIndex)` -- Return `{ preventDefault: true }` to cancel the move
- `_afterMoveTo(newZone, newIndex, oldZone, oldIndex, beforeCache)` -- Called after the move completes

When a card moves within the same zone, index adjustments are handled automatically.

### Visibility

Cards track which players can see them:

| Method | Description |
|--------|-------------|
| `hide()` | Clear visibility (no one can see) |
| `reveal()` | Make visible to all players |
| `show(player)` | Make visible to a specific player |
| `visible(player)` | Check if a player can see this card |
| `revealed()` | Check if all players can see this card |

Visibility is automatically updated when a card enters a zone, based on the zone's kind (see BaseZone).

---

## BaseZone

Zones are ordered containers for cards. They have an id, a display name, a visibility kind, and an optional owner.

### Constructor

```javascript
class BaseZone {
  constructor(game, id, name, kind, owner = null)
}
```

### Zone Kinds

| Kind | Behavior |
|------|----------|
| `'public'` | Cards are revealed to all players on entry |
| `'private'` | Cards are shown only to the zone's owner on entry |
| `'hidden'` | Cards are hidden from everyone on entry |

### Card Operations

| Method | Description |
|--------|-------------|
| `initializeCards(cards)` | Set initial card contents (one-time, sets home zones) |
| `push(card, index)` | Insert a card at a position (removes from previous zone) |
| `remove(card)` | Remove a card from this zone |
| `peek(index=0)` | Get card at position without removing |
| `cardlist()` | Get a copy of all cards in order |
| `nextIndex()` | Get the index after the last card |

### Ordering

| Method | Description |
|--------|-------------|
| `shuffle()` | Randomize card order using the game's seeded RNG |
| `shuffleTop(count)` | Shuffle only the top N cards |
| `shuffleBottom(count)` | Shuffle only the bottom N cards |
| `sort(fn)` | Sort cards with a comparator function |
| `sortByName()` | Sort cards alphabetically by name |
| `random()` | Get a random card using the game's seeded RNG |

### Zone Visibility

Bulk visibility operations that apply to all cards in the zone:

| Method | Description |
|--------|-------------|
| `hide()` | Hide all cards |
| `reveal()` | Reveal all cards to all players |
| `revealNext()` | Reveal the first unrevealed card |
| `show(player)` | Show all cards to a specific player |
| `showNext(player)` | Show the first non-visible card to a player |

---

## BaseCardManager

Registry for all cards in the game. Provides lookup by id, player, and zone.

### Constructor

```javascript
class BaseCardManager {
  constructor(game) {
    this.game = game
    this._cards = {}
    return GameProxy.create(this)
  }
}
```

### Methods

| Method | Description |
|--------|-------------|
| `register(card)` | Add a card to the registry (throws on duplicate ids) |
| `byId(id)` | Get a card by id (throws if not found) |
| `hasId(id)` | Check if a card id exists |
| `all()` | Get all registered cards |
| `byPlayer(player, zoneName)` | Get cards in a player's named zone |
| `byZone(zoneId)` | Get cards in a zone by zone id |
| `reset()` | Clear the registry |

---

## BaseZoneManager

Registry for all zones. Creates zones and provides lookup by id, player, and card.

### Constructor

```javascript
class BaseZoneManager {
  constructor(game) {
    this.game = game
    this._zones = {}
    return GameProxy.create(this)
  }
}
```

### Methods

| Method | Description |
|--------|-------------|
| `create(...args)` | Create a new zone and register it |
| `register(zone)` | Register an existing zone (throws on duplicate ids) |
| `all()` | Get all registered zones |
| `byId(id)` | Get a zone by id |
| `byPlayer(player, zoneName)` | Get a player's zone by convention name |
| `byCard(card)` | Get the zone containing a card |
| `reset()` | Clear all zones |

### Zone Naming Convention

Player zones follow the naming pattern `players.{playerName}.{zoneName}`:

```javascript
// Creating a player zone
zones.create(game, 'players.dennis.hand', 'Hand', 'private', player)

// Retrieving it
zones.byPlayer(player, 'hand')  // Returns the zone with id 'players.dennis.hand'
```

---

## BasePlayerManager

Manages player ordering, seating, and turn tracking.

### Constructor

```javascript
class BasePlayerManager {
  constructor(game, users, opts = {})
}
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `shuffleSeats` | `true` | Randomize seat order using seeded RNG |
| `firstPlayerId` | `null` | Rotate seating so this player is first |
| `playerClass` | `BasePlayer` | Constructor for player instances |

On reset, players are created from user data, optionally shuffled, and assigned `seatNumber` values.

### Turn Management

| Method | Description |
|--------|-------------|
| `current()` | Get the current player |
| `advancePlayer()` | Move current to the next active player |
| `passToPlayer(player)` | Set a specific player as current |

### Getting Multiple Players

| Method | Description |
|--------|-------------|
| `all()` | All players in seat order (returns `PlayerList`, which has `.active()`) |
| `active()` | All non-eliminated players |
| `startingWith(player)` | All players rotated so `player` is first |
| `endingWith(player)` | All players rotated so `player` is last |
| `opponents(player)` | Players on a different team |
| `other(player)` | All players except the given one |
| `teamOf(player)` | Players on the same team |

### Getting Single Players

| Method | Description |
|--------|-------------|
| `byId(id)` | Find by player id |
| `byName(name)` | Find by player name |
| `bySeat(index)` | Find by seat number |
| `first()` | Player in seat 0 |
| `next()` | Next active player after current |
| `following(player)` | Next active player after the given player |
| `preceding(player)` | Previous active player before the given player |
| `leftOf(player)` | Alias for `following()` |
| `rightOf(player)` | Alias for `preceding()` |

---

## BaseActionManager

Provides high-level methods for requesting player input. All methods ultimately call `game.requestInputSingle()`.

### Constructor

```javascript
class BaseActionManager {
  constructor(game) {
    this.game = game
    return GameProxy.create(this)
  }
}
```

### Methods

#### `choose(player, choices, opts)`

General-purpose selection. Returns an array of selected values.

```javascript
const selected = this.actions.choose(player, ['wood', 'clay', 'stone'], {
  title: 'Choose a resource',
  min: 1,
  max: 2,
})
// selected = ['wood'] or ['wood', 'clay']
```

When `min: 0`, the title is automatically prefixed with "(optional)". If choices is empty, logs "no effect" and returns `[]`. If the player selects nothing (with `min: 0`), logs "does not make a selection" and returns `[]`.

If the selector has `allowsAction` and the response is action-based, the action object is returned directly instead of an array. See [action-type-responses.md](./action-type-responses.md).

#### `chooseCard(player, cards, opts)`

Select one card from an array of card objects. Returns the card object.

```javascript
const card = this.actions.chooseCard(player, handCards, { title: 'Play a card' })
```

Cards are presented by name. Supports a `guard` function in opts to reject invalid selections (re-prompts until valid).

#### `chooseCards(player, cards, opts)`

Select multiple cards. Returns an array of card objects.

```javascript
const cards = this.actions.chooseCards(player, handCards, {
  title: 'Discard cards',
  count: 2,
})
```

#### `chooseYesNo(player, title)`

Binary yes/no choice. Returns `true` or `false`.

```javascript
if (this.actions.chooseYesNo(player, 'Use special ability?')) {
  // player chose yes
}
```

#### `choosePlayer(player, choices, opts)`

Select a player from a list. Returns the player object.

```javascript
const target = this.actions.choosePlayer(player, this.players.opponents(player))
```

#### `flipCoin(player)`

Player calls heads or tails, game flips using seeded RNG. Returns `true` if the call was correct.

#### `rollDie(player, faces)`

Roll a die with N faces using seeded RNG. Logs the result. For `faces: 2`, logs heads/tails.

---

## BaseLogManager

Structured logging system with template-based messages, indentation, and a chat system.

### Constructor

```javascript
class BaseLogManager {
  constructor(game, chat, viewerName)
}
```

### Logging

#### `add(msg)`

Add a log entry with a template and optional arguments:

```javascript
this.log.add({
  template: '{player} draws {card} from {zone}',
  args: { player, card, zone },
  classes: ['draw-action'],
})
```

Template placeholders `{key}` are replaced with values from `args`. Arguments are enriched by registered handlers before display.

#### `indent(count=1)` / `outdent(count=1)`

Control log indentation for nested actions:

```javascript
this.log.add({ template: '{player} takes an action' })
this.log.indent()
this.log.add({ template: 'Draws 2 cards' })   // Indented
this.log.add({ template: 'Scores 1 point' })  // Indented
this.log.outdent()
```

#### `setIndent(value)`

Set indentation to an absolute level (clamped to 0 minimum).

#### `addNoEffect()` / `addDoNothing(player, action)`

Convenience methods for common log messages.

### Handler System

Handlers transform log arguments before display. They match by key name:

```javascript
// Register an exact match handler
this.log.registerHandler('resource', (resource) => ({
  value: resource.name,
  classes: ['resource-name'],
}))

// Register a wildcard handler (matches any key starting with 'player')
this.log.registerHandler('player*', (player) => ({
  value: player.name,
  classes: ['player-name'],
}))
```

**Default handlers:**

| Pattern | Behavior |
|---------|----------|
| `players` (exact) | Joins player names with commas |
| `player*` (wildcard) | Extracts `player.name` |
| `card*` (wildcard) | Extracts `card.id` |
| `zone*` (wildcard) | Extracts `zone.name()` |

Subclasses can register additional handlers or override `_postEnrichArgs(entry)` to modify/suppress entries after enrichment.

### Chat System

Chat messages are interleaved with the game log by position:

| Method | Description |
|--------|-------------|
| `chat(playerName, text)` | Add a chat message at the current log position |
| `deleteChat(id)` | Remove a chat message by id |
| `getChat()` | Get all chat messages |
| `merged()` | Get log and chat interleaved by position |
| `newChatsCount(player)` | Count unread chats since the player's last action |

### Other Methods

| Method | Description |
|--------|-------------|
| `getLog()` | Get all log entries |
| `reset()` | Clear the log (called on each `run()`) |
| `responseReceived(data)` | Insert a response marker into the log |
| `reindexChat()` | Clamp chat positions to log length (used after undo) |
