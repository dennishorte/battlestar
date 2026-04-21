# 8. Frontend Integration

After the game engine works end-to-end in tests, wire it up to the Vue 3 frontend. The frontend renders game state, presents choices to players, and submits responses back to the API.

---

## Component Structure

Each game lives in its own module directory:

```
app/src/modules/games/<game>/
├── components/
│   ├── <Game>Game.vue            Main game view (layout, panels)
│   ├── GameLog<Game>.vue         Game-specific log rendering
│   ├── <Game>PlayerPanel.vue     Player status display
│   ├── <Game>Card.vue            Card rendering
│   └── ...                       Sub-components (board, modals, etc.)
└── (no index.js needed — registration is in GameBase.vue)
```

### Shared Infrastructure

All games share common components and infrastructure in `app/src/modules/games/common/`:

| Component/Composable | Purpose |
|----------------------|---------|
| `GameLog.vue` | Base log rendering with token parsing, nesting, visibility |
| `useGameLog.js` / `useLogTokenizer.js` | Provide/inject pattern for game-specific log styling |
| `CardName.vue` | Renders card names as interactive chips |
| `PlayerName.vue` | Renders player names with colors |
| `GameLogText.vue` | Parses tokenized log text into Vue components |
| `WaitingPanel.vue` | Tabbed per-player choice UI using `checkPlayerHasActionWaiting` |
| `WaitingChoice.vue` | Renders selector choices as dropdown/buttons |
| `OptionSelector.vue` | Recursive UI for nested game choice prompts |
| `GameMenu.vue` | Hamburger menu for game-specific actions (rules, scores, etc.) |
| `ChatInput.vue` | In-game chat |
| `BugReportModal.vue` | Bug report dialog (available when game is paused) |
| `SavingOverlay.vue` | Save progress indicator |
| `DebugModal.vue` | Dev tool for inspecting game state |
| `store.js` | Vuex store module for game state management |

Don't rebuild these -- extend them with game-specific overrides.

---

## Registration Steps

Three files must be modified to register a new game:

### 1. GameBase.vue (`app/src/components/GameBase.vue`)

Add the game component to the template and script:

```vue
<!-- In template, add alongside other games -->
<DuneGame v-else-if="gameType === 'Dune Imperium: Uprising'" />

<!-- In script -->
import DuneGame from '@/modules/games/dune/components/DuneGame.vue'

// In components:
DuneGame,
```

The `gameType` string must exactly match `settings.game` from the factory (e.g., `'Dune Imperium: Uprising'`).

### 2. LobbySettings.vue (`app/src/modules/lobby/components/LobbySettings.vue`)

Add the game name to the `gameNames` array and conditionally render a settings component:

```vue
<!-- In template -->
<SettingsDune v-if="lobby.game === 'Dune Imperium: Uprising'" />

<!-- In script -->
import SettingsDune from './SettingsDune.vue'
// Add to components: { ... }
// Add to gameNames array: 'Dune Imperium: Uprising'
```

### 3. Lobby Settings Component (optional)

If the game has options (expansions, player count variants, etc.), create `SettingsDune.vue` in the lobby module. It receives `lobby` and `save` via inject, modifies `lobby.options`, and calls `save()`. Set `lobby.valid` to control when the Start button is enabled.

---

## Provide/Inject Chain

The frontend uses Vue 3's provide/inject for game state propagation:

```
GameBase.vue
  provides: actor, bus (mitt event emitter), game (computed ref)
    └── <Game>Game.vue
          provides: ui (reactive object with fn, modals, selectable state)
            └── All child components
```

Every game component has access to these via `inject: ['actor', 'bus', 'game']`. The main game component additionally provides a `ui` object for game-specific interactive state.

### The `ui` Pattern

The main game component creates a reactive `ui` object and provides it to children:

```javascript
data() {
  return {
    ui: {
      fn: {
        // Functions children can call (click handlers, etc.)
        clickSpace: this.clickSpace,
        getActionTypeHandler: this.getActionTypeHandler,
      },
      modals: {
        // Shared modal state
        cardViewer: { cardId: '' },
      },
      selectable: [],       // Board elements highlighted as valid targets
    },
  }
},

provide() {
  return { ui: this.ui }
},
```

Children inject `ui` and use `ui.fn.*` for interactions, `ui.selectable` to highlight valid targets, etc.

---

## Game-Specific Log Component

The log rendering pipeline uses provide/inject via `useGameLogProvider`:

```vue
<template>
  <GameLog id="gamelog" />
</template>

<script setup>
import { inject } from 'vue'
import GameLog from '@/modules/games/common/components/log/GameLog.vue'
import { useGameLogProvider } from '@/modules/games/common/composables/useGameLog'

const game = inject('game')

// Optional: handle card clicks in log
function cardClick(card) { /* open card viewer modal */ }

// Style card names based on type
function cardStyles(card) { return {} }

// Map player names to colors for chat
function chatColors() {
  const output = {}
  for (const player of game.value.players.all()) {
    output[player.name] = player.color
  }
  return output
}

// Add CSS classes to log lines based on event type
function lineClasses(line) {
  const classes = [`indent-${line.indent}`]
  if (line.event === 'round-start') classes.push('phase-header')
  if (line.classes?.includes('player-turn')) classes.push('player-turn')
  return classes
}

// Dynamic styles (e.g., player color backgrounds for turn headers)
function lineStyles(line) {
  if (line.classes?.includes('player-turn')) {
    const player = game.value.players.byName(line.args.player.value)
    return { 'background-color': player.color }
  }
}

// Player name chip styles
function playerStyles(player) {
  return { 'background-color': player.color }
}

// Register all hooks — GameLog.vue picks these up via inject
useGameLogProvider({
  cardClick,
  cardStyles,
  chatColors,
  lineClasses,
  lineStyles,
  playerStyles,
})
</script>
```

The `convertArg` hook is also available for custom log argument rendering (return a string to replace the default, or `undefined` to use default).

### Log Line Properties

Each log line passed to `lineClasses`/`lineStyles` has:
- `text` — rendered message string with tokens like `card(...)`, `player(...)`
- `classes` — array of CSS classes from the backend log entry
- `args` — enriched arg objects from `BaseLogManager` handlers
- `indent` — nesting level (0 = top-level)
- `event` — event name from the log entry (e.g., `'round-start'`, `'play-card'`)

### Custom Arg Handlers

The backend `DuneLogManager` registers handlers for arg name patterns. These enrich log args with `value` and `classes`:

```javascript
// DuneLogManager registers:
'card*'       -> { value: card.name, classes: ['card-name'] }
'faction*'    -> { value: faction, classes: ['faction-name'] }
'resource*'   -> { value: resource, classes: ['resource-name'] }
'boardSpace*' -> { value: space.name, classes: ['board-space-name'] }
'leader*'     -> { value: leader.name, classes: ['leader-name'] }
```

The frontend `GameLogText.vue` renders these as styled inline spans. Use `:deep()` selectors in the game log component to style them.

---

## Vuex Store Integration

The shared store (`app/src/modules/games/common/store.js`) handles all game state management. Your game components read from it — you don't need a game-specific store.

### Reading Game State

```javascript
// Via inject (preferred in most components)
inject: ['actor', 'game'],

computed: {
  // Player ordering: current viewer first
  orderedPlayers() {
    const viewer = this.game.players.byName(this.actor.name)
    return this.game.players.startingWith(viewer)
  },

  // Check if current player has a pending choice
  optionSelector() {
    if (this.game.state.initializationComplete) {
      const player = this.game.players.byName(this.actor.name)
      if (this.game.checkPlayerHasActionWaiting(player)) {
        return this.game.getWaiting(player)
      }
    }
    return undefined
  },
}
```

### Submitting Actions

Two patterns for submitting player choices:

**Pattern 1: Let WaitingPanel handle it (default)**

Just include `<WaitingPanel />` in your game layout. It renders the choice UI and handles submission automatically via `OptionSelector` → `WaitingChoice`.

**Pattern 2: Board-click actions (action-type responses)**

For spatial interactions (clicking board spaces, tokens, etc.):

```javascript
methods: {
  clickBoardSpace(space) {
    // Direct response to input request
    this.game.respondToInputRequest({
      actor: this.actor.name,
      title: selectorTitle,
      selection: [spaceName],
    })
    this.$store.dispatch('game/save')
  },
}
```

For action-type responses (dual-input pattern):

```javascript
this.game.respondToInputRequest({
  actor: this.actor.name,
  title: '__ALT_ACTION__',
  selection: [{
    action: 'action-name',
    ...actionData,
  }]
})
this.$store.dispatch('game/save')
```

### Accessing Zones and Cards

```javascript
// Zone contents
game.zones.byId('common.imperiumRow').cardlist()   // Array of card objects
game.zones.byId(`${playerName}.hand`).cardlist()   // Player's hand

// Cards by player and zone shorthand (if CardManager supports it)
game.cards.byPlayer(player, 'hand')
game.cards.byPlayer(player, 'played')
```

---

## Spectator/Proxy Input

Any player can submit actions on behalf of another player by switching to their tab in WaitingPanel. Standard `OptionSelector` choices work automatically (WaitingChoice uses `owner.name` as actor). But if your game has **custom input UI** — action-type handlers, bus-based board interactions, or modals — you must explicitly support this.

### The Pattern

The `waiting-player-selected` bus event fires when a user clicks another player's tab. Your game component should:

1. **Track `selectedPlayerName`** as reactive state (on the `ui` object so sub-components can access it)
2. **Listen for the bus event** in `mounted()`/`beforeUnmount()`
3. **Resolve the acting player** as `selectedPlayerName || actor.name` everywhere you currently use `actor.name` for submissions or player-specific UI state

```javascript
// In your game component's data:
ui: {
  selectedPlayerName: null,
  // ...other ui state
}

// Computed helper:
resolvedActorName() {
  return this.ui.selectedPlayerName || this.actor.name
}

// Bus listener:
onWaitingPlayerSelected(name) {
  this.ui.selectedPlayerName = name
}
```

### Where to Use `resolvedActorName`

- All `respondToInputRequest()` calls: `actor: this.resolvedActorName`
- All `bus.emit('submit-action', ...)` calls: `actor: this.resolvedActorName`
- `handleSubmitAction()`: resolve waiting request for the acting player, not just the viewer
- `getActionTypeHandler(request)`: use `request.actor` for submission (it's already the correct player)

### Where to Keep `actor.name`

- `optionSelector` computed (viewer's own waiting request)
- `orderedPlayers` computed (player ordering relative to viewer)
- Ownership checks like "is this my turn?" (comparing against `actor.name`)

### Sub-Component Checklist

Sub-components that gate interactive modes (e.g., "only show clickable board on the acting player's board") should check against `ui.selectedPlayerName || actor.name`, not just `actor.name`:

```javascript
// Before (only works for the viewer):
isActive() { return this.player.name === this.actor.name }

// After (works for spectator proxy input):
isActive() { return this.player.name === (this.ui.selectedPlayerName || this.actor.name) }
```

### Reference Implementation

See `TwilightGame.vue` for the canonical implementation with `selectedPlayerName`, `selectedWaitingRequest`, and per-component `playerName` props passed to action sub-components.

---

## Main Game Component Pattern

The top-level component assembles the layout, manages interactive UI state, and watches for selector changes:

```vue
<template>
  <div class="my-game">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">

        <!-- Column 1: Log -->
        <div class="col history-column">
          <GameMenu>
            <DropdownButton @click="openRules">rules</DropdownButton>
          </GameMenu>
          <GameLogMyGame />
        </div>

        <!-- Column 2: Board / Market / Choices -->
        <div class="col game-column">
          <!-- Game-specific board components -->
          <WaitingPanel />
        </div>

        <!-- Column 3: Player panels -->
        <div class="col game-column">
          <PlayerPanel v-for="player in orderedPlayers" :key="player.name" :player="player" />
        </div>

      </div>
    </div>

    <DebugModal />
  </div>
</template>
```

Key patterns from existing games:
- **Column layout**: history (log) | game area (board + choices) | player panels
- **WaitingPanel**: placed in the game column, handles all standard choice UI
- **GameMenu**: hamburger menu with rules link, score display, etc.
- **DebugModal**: always included for development

---

## Highlighting Valid Targets

When the game presents a choice, highlight valid targets on the board by watching the selector:

```javascript
watch: {
  optionSelector: {
    immediate: true,
    handler(selector) {
      if (selector) {
        // Extract valid target names from choices
        this.ui.selectable = selector.choices
          .filter(c => typeof c === 'string')
          .map(c => c)
      } else {
        this.ui.selectable = []
      }
    },
  },
},
```

Board components read `ui.selectable` to apply CSS classes:

```vue
<div :class="{ clickable: ui.selectable.includes(space.id) }" @click="ui.fn.clickSpace(space)">
```

---

## Development Workflow

1. **Log view first**: The log component is the easiest to build and immediately useful for debugging
2. **Read-only board**: Render the game state without interactions
3. **Choice UI**: Wire up `WaitingPanel` — works with shared infrastructure out of the box
4. **Player panels**: Show resources, hand (for viewer), played cards
5. **Board interactions**: Add clickable elements for action-type selectors
6. **Polish**: Animations, tooltips, card hover previews

---

## References

- **Frontend architecture**: [docs/app.md](../app.md)
- **Action-type responses**: [common/docs/action-type-responses.md](../../common/docs/action-type-responses.md)
- **Log rendering pipeline**: [common/docs/logging.md](../../common/docs/logging.md#technical-implementation)
