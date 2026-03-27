# 6. Cards and Abilities

Most board games have cards or abilities that interact with the game flow in non-linear ways: triggered effects, anytime actions, hooks that fire during specific phases. This section covers the patterns for implementing them.

---

## Card Lifecycle

Cards follow a standard lifecycle managed by the base classes:

1. **Creation** -- Instantiate from a definition object, register with CardManager
2. **Zone placement** -- Cards live in zones (deck, hand, board, discard). Moving between zones updates visibility automatically based on zone kind (public/private/hidden).
3. **Hook dispatch** -- The game engine calls hooks on cards at defined points (play, phase transitions, actions)
4. **Removal** -- Cards can be purged, discarded, or returned to supply

```javascript
// Creation and registration (in initialize)
const cardDef = { id: 'shield-wall', name: 'Shield Wall', type: 'action', ... }
const card = new MyGameCard(this, cardDef)
this.cards.register(card)
card.moveTo(this.zones.byId('deck'))

// Movement (during gameplay)
card.moveTo(playerHandZone)   // Deck → hand (visibility updates automatically)
card.moveTo(playerBoardZone)  // Hand → board
card.moveHome()               // Return to home zone
```

### Custom Card Classes

Extend BaseCard when cards need state beyond id/zone/visibility:

```javascript
class MyGameCard extends BaseCard {
  constructor(game, data) {
    super(game, data)
    this.definition = data          // The raw definition object
    this.counters = {}              // Card-specific counters
    this.attachments = []           // Attached cards or tokens
  }

  get name() { return this.definition.name }
  get type() { return this.definition.type }
  get cost() { return this.definition.cost }
}
```

### Definition Objects vs Card Instances

There are two approaches to card state:

| Approach | How it works | Used by |
|----------|-------------|---------|
| **Definition wrapping** | Card instance wraps a definition object; hooks live on the definition | Agricola |
| **State on game.state** | Cards are thin; complex state lives in `game.state` keyed by card/player | Twilight Imperium |

Definition wrapping works well when each card has unique behavior (hundreds of unique cards). State-on-game.state works well when cards are simpler but game state is complex.

---

## Hook Patterns

Hooks are methods on card definitions (or ability handlers) that the game engine calls at specific points. The game decides which hooks to support based on its mechanics.

### Common Hook Categories

**Play hooks** -- Fired when a card is played from hand:

```javascript
onPlay(game, player, card) {
  // Effect when the card is played
  player.incrementCounter('gold', 2)
}
```

**Phase hooks** -- Fired during specific game phases:

```javascript
onRoundStart(game, player) { ... }      // Start of each round
onReturnHome(game, player) { ... }      // Agricola: workers return
onHarvest(game, player) { ... }         // Agricola: harvest phase
onFeedingPhase(game, player) { ... }    // Agricola: feeding
onFieldPhaseEnd(game, player) { ... }   // Agricola: after field harvest
```

**Action hooks** -- Fired when players take specific actions:

```javascript
onAction(game, player, actionId) { ... }       // Owner takes an action
onAnyAction(game, player, actionId) { ... }    // Any player takes an action
afterPlayerAction(game, player, actionId) { ... }  // After action resolves
```

**Combat hooks** -- Fired during combat resolution:

```javascript
onSpaceCombatStart(player, ctx) { ... }    // Before combat rolls
onSpaceCombatRound(player, ctx) { ... }    // Each combat round
onCombatWon(player, ctx) { ... }           // After winning combat
```

**Scoring hooks** -- Fired during end-game scoring:

```javascript
getEndGamePoints(game, player) {
  return player.getCounter('buildings') >= 5 ? 3 : 0
}
```

### Hook Dispatch

The game engine iterates over a player's active cards and calls matching hooks. The dispatch pattern:

```javascript
MyGame.prototype.callCardHook = function(player, hookName, ...args) {
  const cards = this.getActiveCards(player)
  for (const card of cards) {
    if (card.definition[hookName]) {
      card.definition[hookName](this, player, ...args)
    }
  }
}
```

For games with many cards, use the `matches_` gating convention (see [Logging Design](05-logging-design.md#the-trigger-logging-convention)) to avoid noisy trigger logging.

---

## Triggered Abilities

Triggered abilities fire in response to game events. They need three things:

1. **A trigger condition** -- When does this fire? (e.g., "when you take a stone action")
2. **A dispatch point** -- Where in the code does the engine check for triggers?
3. **A resolution** -- What happens when the trigger fires?

### Dispatch Points

Add dispatch points at natural boundaries in your game flow:

```javascript
MyGame.prototype.resolveAction = function(player, actionId) {
  // Pre-action triggers
  this.callCardHook(player, 'beforeAction', actionId)

  // Resolve the action
  this.executeAction(player, actionId)

  // Post-action triggers (for owner)
  this.callCardHook(player, 'onAction', actionId)

  // Post-action triggers (for all players)
  for (const p of this.players.all()) {
    this.callCardHook(p, 'onAnyAction', actionId, player)
  }
}
```

### Trigger Ordering

When multiple abilities trigger simultaneously, define a resolution order:

- **Card play order** -- Cards trigger in the order they were played (Agricola)
- **Seat order** -- Players resolve in seat order starting from active player (Twilight)
- **Player choice** -- Active player chooses the order (some games)

Document the chosen order in your game's testing guide.

---

## Anytime Actions

Anytime actions are things a player can do outside the normal turn flow -- typically conversions, exchanges, or abilities that can be activated during any choice prompt.

### Types of Anytime Actions

| Type | Example | Integration |
|------|---------|-------------|
| **Resource conversion** | "Pay 1 grain for 1 food" | Available during feeding/choice prompts |
| **Card ability** | "Exhaust to draw a card" | Available on the player's turn |
| **Scheduled event** | "Collect 2 wood at round start" | Auto-triggered at specific times |

### Implementation Pattern

```javascript
MyGame.prototype.getAnytimeActions = function(player) {
  const actions = []

  // Scan player's cards for anytime abilities
  for (const card of this.getActiveCards(player)) {
    if (card.definition.anytimeAction) {
      const action = card.definition.anytimeAction(this, player)
      if (action) {
        actions.push({ cardName: card.name, ...action })
      }
    }
  }

  return actions
}
```

The choice system integrates anytime actions by making them available alongside normal choices. See Agricola's `anytime.js` for a full implementation.

---

## Component Actions (Faction/Character Abilities)

For games where players have unique abilities (factions, characters, leaders), use a handler-per-entity pattern:

```javascript
// systems/factions/myFaction.js
module.exports = {
  factionId: 'my-faction',

  // Component actions (activated abilities)
  componentActions: [
    {
      id: 'special-ability',
      name: 'Use Special Ability',
      isAvailable(player, game) {
        return player.getCounter('charges') > 0
      },
    },
  ],

  // Named method for the component action
  specialAbility(player, ctx) {
    player.decrementCounter('charges')
    ctx.log.add({ template: '{player} uses special ability', args: { player } })
    // ... effect
  },

  // Passive effects (hooks)
  commanderEffect: {
    timing: 'onAction',
    apply(player, ctx, actionId) {
      if (actionId === 'trade') {
        player.incrementCounter('gold', 1)
      }
    },
  },
}
```

A central dispatcher routes to the appropriate handler:

```javascript
// systems/factionAbilities.js
const handlers = {
  'my-faction': require('./factions/myFaction'),
  'other-faction': require('./factions/otherFaction'),
}

MyGame.prototype.getFactionHandler = function(player) {
  return handlers[player.factionId]
}
```

This is the pattern Twilight Imperium uses for its 26 factions. It keeps each faction's logic isolated while the dispatcher manages routing and hook integration.

---

## Interaction Patterns

When abilities interact with each other, define clear precedence rules:

1. **Replacement effects** override the default behavior (e.g., "instead of gaining 2 gold, gain 3")
2. **Triggered effects** fire after the event (e.g., "when you gain gold, also gain 1 food")
3. **Prevention effects** cancel the event (e.g., "cancel 1 hit")

Log these interactions explicitly so players can follow the chain:

```
dennis gains 2 gold
  Merchant Guild triggers for dennis
    dennis also gains 1 food
```

---

## References

- **Base card/zone classes**: [common/docs/base-classes.md](../../common/docs/base-classes.md)
- **Trigger logging**: [common/docs/logging.md](../../common/docs/logging.md#card-hook-trigger-logging-matches-convention)
- **Anytime actions (Agricola)**: `common/agricola/docs/specs/anytime-actions.md`
- **Faction system (Twilight)**: `common/twilight/docs/specs/faction-implementation.md`
