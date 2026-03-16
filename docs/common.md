# Common Game Framework

## Overview

The `battlestar-common` package provides the shared game logic used by both the API and frontend. All games inherit from a base framework that handles game state, player turns, input requests, logging, cards, and zones.

## Entry Point (`main.js`)

```javascript
const { fromData, fromLobby } = require('battlestar-common')
```

- `fromData(gameData, viewerName)` - Reconstructs game from serialized data
- `fromLobby(lobby)` - Creates new game from lobby settings
- Exports: `GameOverEvent`, `InputRequestEvent`, game modules (agricola, magic, tyrants, ultimate)

## Game Class (`lib/game.js`)

The core class all games extend. Key concepts:

### State & Lifecycle
- `state` - Ephemeral state (resets on each `run()`)
- `settings` - Immutable game config (game name, players, seed)
- `responses` - Complete action history (append-only)
- `branchId` - Concurrent request tracking
- `random` - Seeded RNG (deterministic via `seedrandom`)

### Execution Model
- `run()` - Main loop: resets state → calls `_mainProgram()` → catches events
- Games pause by **throwing `InputRequestEvent`** (contains selectors for player input)
- Games end by **throwing `GameOverEvent`** (contains winner/reason)
- On each `run()`, the entire game replays from the start using stored responses

### Input Request System
- `requestInputSingle(selector)` - Single player, returns selection
- `requestInputMany(selectors)` - Multiple players, blocks until all respond
- `requestInputAny(selectors)` - Concurrent requests (e.g., drafting)
- Auto-responds when only one valid choice exists
- Selectors: `{ actor, title, choices[], min?, max?, count? }`

### Response Handling
- `respondToInputRequest(response)` - Player submits choice
- Response appended to `responses[]`, then `run()` replays

### Undo
- `undo()` - Removes last user response (skips auto-responses), re-runs game

### Serialization
- `serialize()` - Returns `{ _id, settings, responses, branchId, chat }`
- `historicalView(index)` - Replay game to specific response index

## Manager Classes

All managers are wrapped in `GameProxy` which transparently delegates access to game properties (`this.log`, `this.players`, `this.zones`, etc.).

### BaseActionManager (`lib/game/BaseActionManager.js`)

Player choice interface:
- `choose(player, choices, opts)` - Single/multi-choice selection
- `chooseCard(player, choices, opts)` - Pick one card by name
- `chooseCards(player, choices, opts)` - Pick multiple cards with optional guard function
- `choosePlayer(player, choices, opts)` - Select from player list
- `chooseYesNo(player, title)` - Binary choice, returns boolean
- `flipCoin(player)` - Random coin flip with logging
- `rollDie(player, faces)` - Die roll with logging

### BasePlayer (`lib/game/BasePlayer.js`)

Individual player state:
- Properties: `id`, `name`, `team`, `seatNumber`, `eliminated`
- **Counter system**: `addCounter`, `incrementCounter`, `decrementCounter`, `setCounter`, `getCounter`
  - All counter changes are logged unless `{silent: true}`
- Helpers: `isCurrentPlayer()`, `isOpponent(other)`, `static isActive(player)`

### BasePlayerManager (`lib/game/BasePlayerManager.js`)

Player collection and turn management:
- **Turn flow**: `advancePlayer()`, `passToPlayer(player)`, `current()`
- **Queries**: `all()`, `active()`, `byId()`, `byName()`, `bySeat()`
- **Order**: `first()`, `next()`, `preceding()`, `following()`, `startingWith()`, `endingWith()`
- **Teams**: `opponents(player)`, `teamOf(player)`, `other(player)`
- Returns `PlayerList` (extends Array) for chainable queries

### BaseZone (`lib/game/BaseZone.js`)

Card container with visibility:
- **Zone kinds**: `public` (all see), `private` (owner sees), `hidden` (nobody sees)
- **Card operations**: `push(card)`, `remove(card)`, `peek()`, `cardlist()`
- **Ordering**: `shuffle()`, `shuffleTop(n)`, `shuffleBottom(n)`, `sort()`, `sortByName()`
- **Visibility**: `reveal()`, `hide()`, `show(player)`, `visible(player)`
- Cards' visibility auto-adjusts when moving between zones

### BaseZoneManager (`lib/game/BaseZoneManager.js`)

Zone registry:
- `create()` - Create and register zone
- `byId(id)` - Lookup by id
- `byCard(card)` - Zone containing card
- `byPlayer(player, zoneName)` - Player's zone (id: `players.{name}.{zone}`)

### BaseCard (`lib/game/BaseCard.js`)

Card with movement and visibility:
- Properties: `id`, `data`, `owner`, `home`, `zone`, `visibility`
- `moveTo(zone, index)`, `moveToTop(zone)`, `moveHome()`
- `reveal()`, `show(player)`, `hide()`, `visible(player)`
- Hooks: `_beforeMoveTo()`, `_afterMoveTo()` for game-specific logic

### BaseCardManager (`lib/game/BaseCardManager.js`)

Card registry:
- `register(card)`, `all()`, `byId(id)`, `byZone(zoneId)`, `byPlayer(player, zoneName)`

### BaseLogManager (`lib/game/BaseLogManager.js`)

Game history and chat:
- `add(msg)` - Log entry with template, args, classes, visibility
- `chat(playerName, text)`, `deleteChat(id)` - Chat messages
- `indent()`, `outdent()` - Log indentation
- `merged()` - Combined log and chat chronologically
- **Arg handlers**: Template enrichment (`player*` → name + class, `card*` → id + class, etc.)

### GameProxy (`lib/game/GameProxy.js`)

JavaScript Proxy that intercepts property access on managers, redirecting reads of `log`, `actions`, `cards`, `players`, `state`, `util`, `zones` to the game instance.

## Selector & Validation (`lib/selector.js`)

- `getSelectorType(selector)` - Returns `'select'` or `'action'`
- `minMax(selector)` - Calculate min/max selections
- `validate(selector, selection)` - Validate response against request
- Supports nested selectors for multi-stage choices

## Transition Factories (`lib/transitionFactory.js`)

State machine helpers for complex game phases:
- `transitionFactory(data, generator, responder)` - Basic transition
- `stepFactory(steps)` - Sequential step execution
- `transitionFactory2({ steps })` - Multi-step with response handling
- `phaseFactory({ steps })` - Repeating phase steps with `nextPhase(context)`

Context object: `context.state` (game), `context.data` (transition state), `context.response` (input), `context.push()`, `context.done()`

## Utilities (`lib/util.js`)

- **Array**: `chunk`, `collect`, `countBy`, `distinct`, `groupBy`, `intersection`, `shuffle`, `select`, `selectMany`, `toDict`, `uniqueMaxBy`, etc.
- **Dict**: `strictEquals`, `map`, `compare`, `displayDifferences`
- **String**: `toCamelCase`, `toKebabCase`, `toTitleCase`, `toSnakeCase`, etc.
- **Other**: `assert`, `deepcopy`, `range`, `ensure`, `hasOwn`
