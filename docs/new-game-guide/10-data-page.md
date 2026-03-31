# 10. Data Page

After the game engine and card definitions are complete, create a data page so players can browse all cards and game data outside of a running game. Data pages live in `app/src/modules/data/` alongside the existing game data pages.

---

## What a Data Page Does

- Displays all card/resource definitions from `common/<game>/res/`
- Provides search (Ctrl+F-friendly and in-page text filter)
- Organizes data into tabs by card type
- Supports sorting by column headers
- Supports filtering by source/expansion

A good data page is both browsable (clear layout, grouping by category) and searchable (all text content visible in the DOM so browser find works).

---

## File Structure

```
app/src/modules/data/components/
├── <Game>Cards.vue          Main data page component
└── <Game>CardSet.vue         Optional: sub-component for grouped display
```

The simplest approach is a single component with tabs. Use a sub-component only if you need a reusable card rendering (e.g., TyrantsCardSet renders cards using the in-game GameCard component).

---

## Implementation Steps

### 1. Create the Component

Create `app/src/modules/data/components/<Game>Cards.vue`:

```vue
<template>
  <div class="<game>-data container-fluid">
    <GameHeader />

    <h3 class="mb-3">Game Name — Cards</h3>

    <!-- Search and filter controls -->
    <div class="filters mb-3">
      <input type="text" class="form-control form-control-sm d-inline-block w-auto me-2"
             v-model="search" placeholder="Search..." />
      <select v-model="selectedSource" class="form-select form-select-sm d-inline-block w-auto">
        <option value="">All Sources</option>
        <option v-for="s in sources" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <!-- Tabs for card types -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <a class="nav-link" :class="{ active: activeTab === tab.id }"
           @click="activeTab = tab.id">
          {{ tab.name }} ({{ filteredCards(tab.id).length }})
        </a>
      </li>
    </ul>

    <!-- Table per tab — columns match the card type's fields -->
    <table v-if="activeTab === 'someType'" class="table table-sm table-striped">
      <thead><tr>
        <th @click="sort('name')" class="sortable">Name</th>
        <!-- ... columns for this card type's fields ... -->
      </tr></thead>
      <tbody>
        <tr v-for="card in filteredCards('someType')" :key="card.name">
          <td><strong>{{ card.name }}</strong></td>
          <!-- ... -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { myGame } from 'battlestar-common'
import GameHeader from '../../../components/GameHeader.vue'

export default {
  name: 'MyGameCards',
  components: { GameHeader },
  data() {
    return { activeTab: 'someType', search: '', selectedSource: '', sortKey: 'name', sortAsc: true }
  },
  methods: {
    rawCards(tabId) { /* return the array for each tab */ },
    filteredCards(tabId) { /* filter by search + source, then sort */ },
    sort(key) { /* toggle sort direction */ },
  },
}
</script>
```

Key patterns:
- **Import data from `battlestar-common`** — access `res.cards` directly, not through game instances.
- **One table per card type** — each card type has different fields, so use separate tables with appropriate columns.
- **Search across all text fields** — filter by lowercased substring match on name, abilities, effects, etc.
- **Sortable columns** — add `@click="sort('field')"` and `.sortable` class to `<th>` elements.
- **Show counts inline** — display quantities next to card names (e.g., "x2").

### 2. Register the Route

Add the route in `app/src/modules/data/router.js`:

```javascript
import MyGameCards from './components/MyGameCards.vue'

// Add to the routes array:
{
  path: '/data/mygame/cards',
  name: 'MyGame Cards',
  title: 'MyGame Cards',
  component: MyGameCards,
},
```

### 3. Add to the Data Hub

Add a link in `app/src/modules/data/components/GameData.vue`:

```vue
<li><router-link to="/data/mygame/cards">MyGame Cards</router-link></li>
```

---

## Design Guidelines

- **All text visible in DOM**: Don't hide card text behind tooltips or modals. Browser Ctrl+F must find any card by name, ability text, or keyword.
- **Tables over cards**: For data pages, tables are more scannable and searchable than card-style layouts. Save the card rendering for in-game use.
- **Minimal styling**: Use Bootstrap table classes (`table-sm`, `table-striped`). Add faction/type badges with color coding if the game has factions.
- **No game state dependency**: Data pages render static card definitions. They must not require a running game instance.
- **Tab counts**: Show the count of visible items in each tab header so users can see filter effects at a glance.

---

## Examples

| Game | Component | Approach |
|------|-----------|----------|
| Dune Imperium | `DuneCards.vue` | Tabbed tables — 10 tabs for different card types, search + source filter, sortable columns |
| Tyrants | `TyrantsCards.vue` + `TyrantsCardSet.vue` | Column layout by expansion, reuses in-game `GameCard` component |
| Innovation | `InnovationCards.vue` + `InnovationCardSet.vue` | Column layout by expansion set |
| Twilight | `TwilightData.vue` | Tabbed tables with search, expandable rows for detail |
| Agricola | `AgricolaCards.vue` | Tabbed by card type with set filter |
