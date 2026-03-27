# 8. Frontend Integration

After the game engine works end-to-end in tests, wire it up to the Vue 3 frontend. The frontend renders game state, presents choices to players, and submits responses back to the API.

---

## Component Structure

Each game lives in its own module directory:

```
app/src/modules/games/<game>/
├── index.js                  Route registration
├── <Game>Game.vue            Main game view (layout, panels)
├── <Game>Board.vue           Board/play area component
├── <Game>PlayerPanel.vue     Player status display
├── <Game>Log.vue             Game-specific log rendering
├── components/               Sub-components (cards, tokens, dialogs)
│   ├── <Game>Card.vue
│   ├── <Game>ActionPanel.vue
│   └── ...
└── composables/              Game-specific composables
    └── use<Game>State.js
```

### Shared Infrastructure

All games share common components and infrastructure in `app/src/modules/games/common/`:

| Component/Composable | Purpose |
|----------------------|---------|
| `GameLog.vue` | Base log rendering with token parsing |
| `useLogTokenizer.js` | Parses `player(...)`, `card(...)` tokens into Vue components |
| `CardName.vue` | Renders card names as interactive chips |
| `PlayerName.vue` | Renders player names with colors |
| `store.js` | Vuex store module for game state management |

Don't rebuild these -- extend them with game-specific overrides.

---

## Required Components

### Main Game View

The top-level component that assembles the game layout:

```vue
<template>
  <div class="game-container">
    <GameBoard />
    <GameLog />
    <PlayerPanel v-for="player in players" :key="player.name" :player="player" />
    <ActionPanel v-if="isMyTurn" />
  </div>
</template>
```

This component reads from the Vuex store and passes data to children.

### Game-Specific Log Component

Override the shared `GameLog.vue` to add game-specific styling:

```javascript
// In your game's log component
export default {
  methods: {
    cardClasses(cardId) {
      const card = this.game.cards.byId(cardId)
      return [`card-type-${card.type}`]  // e.g., card-type-action, card-type-unit
    },
    lineClasses(entry) {
      if (entry.event === 'combat') return ['combat-line']
      return []
    },
  },
}
```

The frontend rendering pipeline for logs:
1. Backend `BaseLogManager._enrichLogArgs()` matches arg keys to handlers
2. Frontend `GameLog.vue:convertLogMessage()` maps enriched args to tokens
3. Frontend `useLogTokenizer.js` parses tokens into Vue components
4. Game-specific log component provides `cardClasses()` for type-specific styling

---

## Vuex Store Integration

Game state is managed through the shared Vuex store module. The store handles:

- Fetching game state from the API
- Submitting player responses
- Tracking the current input request (what the game is waiting for)
- Managing undo

Your game component reads from the store:

```javascript
computed: {
  game() { return this.$store.getters['game/game'] },
  waiting() { return this.$store.getters['game/waiting'] },
  isMyTurn() { return this.waiting?.selectors?.some(s => s.actor === this.myName) },
  currentChoices() { return this.waiting?.selectors?.[0]?.choices || [] },
}
```

---

## Action-Type UI

For games with spatial board interactions (clicking on a board), implement the dual-input pattern:

1. The selector has `allowsAction: 'action-name'` plus enumerated `choices` as fallback
2. The board component renders clickable elements for valid targets
3. On click, submit an action-type response: `{ action: 'action-name', ...data }`
4. The dropdown fallback is always available for accessibility

```vue
<!-- Board component with clickable spaces -->
<template>
  <div class="board">
    <div
      v-for="space in validSpaces"
      :key="space.id"
      class="space"
      :class="{ clickable: isValidTarget(space) }"
      @click="selectSpace(space)"
    />
  </div>
</template>

<script>
export default {
  methods: {
    selectSpace(space) {
      this.$store.dispatch('game/submitAction', {
        action: 'select-space',
        row: space.row,
        col: space.col,
      })
    },
  },
}
</script>
```

See [action-type-responses.md](../../common/docs/action-type-responses.md) for the full specification.

---

## Game Registration

To make the frontend aware of your game:

1. **Route**: Add a route in your game's `index.js` that maps the game URL to your main component
2. **Game list**: Add the game to the game selection UI so players can create lobbies
3. **Game options**: If your game has settings (player count, expansions, card sets), create a lobby options component

Follow the pattern of existing games in `app/src/modules/games/` for the exact registration mechanism.

---

## Development Workflow

1. **Engine first**: Get the game working fully in tests before touching the frontend
2. **Log view first**: The log component is the easiest to build and immediately useful for debugging
3. **Read-only board**: Render the game state without interactions
4. **Choice UI**: Wire up the choice dropdown (works with the shared infrastructure out of the box)
5. **Board interactions**: Add clickable elements for action-type selectors
6. **Polish**: Animations, tooltips, card hover previews

---

## References

- **Frontend architecture**: [docs/app.md](../app.md)
- **Action-type responses**: [common/docs/action-type-responses.md](../../common/docs/action-type-responses.md)
- **Log rendering pipeline**: [common/docs/logging.md](../../common/docs/logging.md#technical-implementation)
