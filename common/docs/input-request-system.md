# Input Request System

This document describes the input request system used across all games in the game-center platform.

## Overview

The game engine uses an exception-driven control flow for handling user input. When a game needs input from a player, it throws an `InputRequestEvent`. The game state is deterministically replayed from stored responses each time `game.run()` is called.

### InputRequestEvent

```javascript
function InputRequestEvent(selectors, opts = {}) {
  this.selectors = selectors        // Array of selector objects
  this.concurrent = opts.concurrent // Whether responses are independent
}
```

The `concurrent` flag indicates whether multiple players' responses can be processed independently:
- `concurrent: false` (default) - Responses are sequential or must be collected together
- `concurrent: true` - Responses are independent and don't interfere with each other

## Request Methods

### `requestInputSingle(selector)`

Requests input from a single player and returns their selection.

**Parameters:**
- `selector` - A selector object describing the input request

**Returns:** `Array` - The selection array from the response

**Usage:**
```javascript
const selection = game.requestInputSingle({
  actor: player.name,
  title: 'Choose Action',
  choices: ['attack', 'defend', 'skip']
})
// selection = ['attack'] (array with one element for single selection)
```

**When to use:**
- Turn-based actions where one player makes a decision
- Any single-player choice during normal gameplay

---

### `requestInputMany(selectors)`

Requests input from multiple players. Collects all responses before returning.

**Parameters:**
- `selectors` - Array of selector objects, one per player

**Returns:** `Array` - Array of response objects, one per player

**Usage:**
```javascript
const responses = game.requestInputMany([
  { actor: 'player1', title: 'Choose Card', choices: [...] },
  { actor: 'player2', title: 'Choose Card', choices: [...] },
])
// responses = [
//   { actor: 'player1', title: 'Choose Card', selection: ['cardA'] },
//   { actor: 'player2', title: 'Choose Card', selection: ['cardB'] },
// ]
```

**When to use:**
- Simultaneous selections (e.g., initial card picks in Innovation)
- Deck selection at game start
- Any scenario where multiple players must all respond before the game can continue

**Behavior:**
- Loops until all players have responded
- Attempts auto-response if selection is forced (min >= choices.length)
- Responses are collected in order but can be processed together

---

### `requestInputAny(selectors)`

Requests input where ANY of the listed players can respond. Returns the first response received.

**Parameters:**
- `selectors` - Array of selector objects for players who can respond

**Returns:** `Object` - Single response object from whichever player responded

**Usage:**
```javascript
const response = game.requestInputAny([
  { actor: 'player1', title: 'Draft Card', choices: [...] },
  { actor: 'player2', title: 'Draft Card', choices: [...] },
])
// response = { actor: 'player2', title: 'Draft Card', selection: ['cardX'] }
```

**When to use:**
- Magic card drafting where multiple players can draft simultaneously
- Any scenario where the first available player should act
- Priority-based systems where turn order is fluid

---

## Selector Object Format

```javascript
{
  type: 'select',           // 'select' (enumerated choices) or 'action' (freeform)
  actor: 'playerName',      // Player who must respond
  title: 'Prompt Text',     // Displayed to the user
  choices: [...],           // Array of available options
  min: 1,                   // Minimum selections (default: 1)
  max: 1,                   // Maximum selections (default: 1)
  count: 2,                 // Exact count (overrides min/max)
}
```

### Nested Choices

Choices can be nested for hierarchical selections:

```javascript
{
  actor: 'dennis',
  title: 'Choose Action',
  choices: [
    {
      title: 'Dogma',
      choices: ['Archery', 'The Wheel', 'Mathematics']
    },
    {
      title: 'Meld',
      choices: ['card-1', 'card-2'],
      min: 0,
      max: 1
    }
  ]
}
```

---

## Response Object Format

```javascript
{
  actor: 'playerName',      // Player who responded
  title: 'Prompt Text',     // Must match request title
  selection: [...],         // Array of selected values
  isUserResponse: true,     // Set automatically for user actions
}
```

For nested selections:
```javascript
{
  title: 'Choose Action',
  selection: [{
    title: 'Dogma',
    selection: ['Archery']
  }]
}
```

---

## Input Request Patterns

### Pattern 1: Sequential Turn-Based

The most common pattern where players take turns.

```
Player 1's turn
    └── requestInputSingle({actor: 'player1', ...})
    └── Process action
    └── Update game state
Player 2's turn
    └── requestInputSingle({actor: 'player2', ...})
    └── Process action
    └── Update game state
```

**Race condition handling:** Only one player can act at a time. Server validates that the correct player is responding.

**Games:** Innovation (normal turns), Tyrants (action selection)

---

### Pattern 2: Simultaneous Selection

All players make selections before any are processed.

```
Game start
    └── requestInputMany([player1_selector, player2_selector, ...])
    └── Wait for ALL responses
    └── Process all selections together
    └── Continue game
```

**Race condition handling:** No race condition - game blocks until all players respond. Order of submission doesn't affect outcome.

**Games:**
- Innovation (first card picks - sorted by card name)
- Magic (deck selection at start)

---

### Pattern 3: Any-Player Response (Drafting)

Multiple players can act, first response wins.

```
Draft round
    └── requestInputAny([player1_options, player2_options, ...])
    └── First player to respond gets processed
    └── Loop continues with remaining players
```

**Race condition handling:** Intentionally allows concurrent submissions. Server processes first valid response, others may become invalid.

**Games:** Magic Cube Draft

---

### Pattern 4: Conditional Multi-Player

Some games have scenarios where either one player or multiple players need to respond based on game state.

```
Dogma action
    └── If sharing: requestInputMany([active_player, sharing_players...])
    └── If not sharing: requestInputSingle({actor: active_player})
```

**Games:** Innovation (dogma sharing)

---

## State Management and Race Conditions

### Server-Side Protection

1. **AsyncLock per game:** All requests for a game are serialized server-side
2. **Smart branchId validation:** Optimistic locking with awareness of response modes
3. **Game killed check:** Prevents saves after game termination

### Client-Side Protection

1. **Request queuing:** Client blocks new submissions until previous completes
2. **State verification:** Client compares serialized state after each save
3. **Conflict alerts:** User prompted to reload on branchId mismatch

### Concurrent Response Mode

Each `InputRequestEvent` includes a `concurrent` flag that indicates whether responses are independent:

| Request Method | `concurrent` | Meaning |
|---------------|--------------|---------|
| `requestInputSingle` | `false` | Sequential - responses may affect game state |
| `requestInputMany` | `false` | Simultaneous - all must respond, but collected together |
| `requestInputAny` | `true` | Independent - responses don't interfere with each other |

The server uses this flag to determine branchId behavior:

**When `concurrent: true` (drafting):**
- branchId check is skipped entirely
- Multiple players can submit responses without conflicts
- branchId only updates when leaving concurrent mode (e.g., draft ends)

**When `concurrent: false` (turns, simultaneous selection):**
- branchId updates only when waiting players change significantly
- Collecting responses (players removed from waiting) keeps same branchId
- New players being added triggers branchId update

### When Race Conditions Matter

| Scenario | `concurrent` | Race Condition Risk | Mitigation |
|----------|--------------|---------------------|------------|
| Turn-based (one player acts) | `false` | High - wrong player might submit | branchId + server validation |
| Simultaneous selection | `false` | Low - all must respond | branchId stays same until all respond |
| Drafting | `true` | None - intentionally independent | branchId check skipped |
| Undo during opponent's turn | `false` | Medium - state divergence | branchId + full state sync |

### branchId Update Rules

The server determines whether to update branchId based on waiting state changes:

```javascript
function shouldUpdateBranchId(previousWaiting, currentWaiting) {
  // No previous state - always update
  if (!previousWaiting) return true

  // Game over or no longer waiting - checkpoint reached
  if (!currentWaiting) return true

  // Concurrent mode (drafting) - only update if leaving concurrent mode
  if (previousWaiting.concurrent) {
    return !currentWaiting.concurrent
  }

  // Non-concurrent - update only if new players added
  // (Players being removed = still collecting responses)
  return hasNewPlayers(previousWaiting.players, currentWaiting.players)
}
```

### branchId Flow Examples

**Turn-based game (Innovation):**
```
1. Game waiting for [player1], branchId=100
2. Player1 submits action
3. Game now waiting for [player2] (new player)
4. branchId updates to 101
```

**Simultaneous selection (first picks):**
```
1. Game waiting for [player1, player2], branchId=100
2. Player1 submits first pick
3. Game still waiting for [player2] (subset - still collecting)
4. branchId stays 100
5. Player2 submits first pick (branchId=100 still valid!)
6. All collected, game advances to turns
7. branchId updates to 101
```

**Concurrent drafting (Magic):**
```
1. Game waiting for [player1, player2, player3], concurrent=true, branchId=100
2. Player2 drafts a card
3. Still concurrent, branchId stays 100
4. Player1 drafts a card (branchId=100 still valid!)
5. Player3 drafts a card (branchId=100 still valid!)
6. ... entire draft proceeds with branchId=100
7. Draft ends, game transitions to deck building
8. branchId updates to 101
```

---

## Auto-Response

The system can automatically respond to forced selections:

**Conditions for auto-response:**
1. Selector type is 'select' (not 'action')
2. No nested choice structures
3. `min >= choices.length` (must select all available options)

**Example:**
```javascript
// If player must select 2 cards and only 2 are available:
{
  actor: 'player1',
  title: 'Discard Cards',
  choices: ['card1', 'card2'],
  count: 2
}
// System auto-responds with selection: ['card1', 'card2']
```

---

## Helper Methods (BaseActionManager)

Higher-level methods that wrap requestInputSingle:

| Method | Description | Returns |
|--------|-------------|---------|
| `choose(player, choices, opts)` | General selection | `Array` of selections |
| `chooseCard(player, cards, opts)` | Select one card | `Card` object |
| `chooseCards(player, cards, opts)` | Select multiple cards | `Array<Card>` |
| `chooseYesNo(player, title)` | Binary choice | `boolean` |
| `choosePlayer(player, players, opts)` | Select a player | `Player` object |

---

## Validation

All selections are validated using `selector.validate()`:

1. **Title match:** Response title must match request title
2. **Selection existence:** Each selection must exist in choices
3. **Count validation:** Selection count must be within min/max bounds
4. **Nested validation:** Nested selections are recursively validated
5. **Exclusive options:** Options marked `exclusive` cannot be combined

Error messages indicate the specific validation failure:
- "Invalid number of options selected: expected X-Y, got Z"
- "Selection X didn't exist in the choices"
- "Exclusive choice mixed with other choices"
