# Faction Implementation Spec

## Architecture

All faction ability logic lives in `systems/factionAbilities.js`. This module uses the `GameProxy` pattern (same as `BaseActionManager`), giving it access to `this.state`, `this.players`, `this.log`, `this.actions` via proxy, and `this.game` for other game methods.

```
twilight.js  ──delegates──>  factionAbilities.js
                              ├── Passive Modifiers (pure queries)
                              ├── Component Actions (data-driven registry)
                              ├── Combat Triggers (event hooks)
                              └── Transaction Triggers (event hooks)
```

The game constructor wires it:
```js
this.factionAbilities = new FactionAbilities(this)
```

Call sites in `twilight.js` are thin delegations: `this.factionAbilities.getCombatModifier(player)`.

### Thin wrappers stay in twilight.js

Methods like `_getInitiative` and `_getFleetLimit` combine faction bonuses with core game logic. They stay in `twilight.js` but use `this.factionAbilities._hasAbility()` for the faction check.

---

## Ability Categories

### A. Passive Modifiers

Pure value queries — no mutation, no prompts. Return a number or boolean.

| Method | Returns | Example |
|--------|---------|---------|
| `getCombatModifier(player)` | Number (+1 fragile, -1 unrelenting) | Combat dice |
| `getStatusPhaseTokenBonus(player)` | Number (0 or 1) | Versatile |
| `canTradeWithNonNeighbors(player)` | Boolean | Guild Ships |
| `getTechPrerequisiteSkips(player, tech)` | Number (0 or 1) | Analytical |

**How to add a passive modifier:**
1. Add method to `FactionAbilities` class
2. Replace inline check in `twilight.js` with delegation call
3. Write gameplay test that exercises the ability through normal game flow

### B. Component Actions

Data-driven registry. Each entry has `id`, `name`, `abilityId`, `isAvailable(player)`, and `execute` (method name).

```js
_componentActionHandlers = [
  {
    id: 'orbital-drop',
    name: 'Orbital Drop',
    abilityId: 'orbital-drop',
    isAvailable: (player) => player.commandTokens.tactics >= 1,
    execute: '_orbitalDrop',
  },
]
```

**How to add a component action:**
1. Add handler entry to `_componentActionHandlers` array
2. Add execute method (e.g., `_orbitalDrop`) to the class
3. Register the ability ID in the faction's data file (`res/factions/`)
4. Write test: Component Action → choose action → verify effect

### C. Combat Triggers

Event-driven methods called from the space combat flow.

| Hook | Called From | When |
|------|-----------|------|
| `onSpaceCombatStart(systemId, attacker, defender)` | `_spaceCombat` | Before AFB |

**How to add a combat trigger:**
1. Add logic inside `onSpaceCombatStart` (or add new hook if timing differs)
2. Use `this.game.random()` for dice, `this.game._getUnitStats()` for unit data
3. Write test: move ships into enemy system, verify combat outcome

### D. Transaction Triggers

Called after trade completes.

| Hook | Called From | When |
|------|-----------|------|
| `onTransactionComplete(player)` | `_executeTransaction` | After exchange |

**How to add a transaction trigger:**
1. Add logic inside `onTransactionComplete`
2. Use `this.game.areNeighbors()` for adjacency checks
3. Write test: set up trade between neighbors, verify trigger effect

---

## Testing Requirements

All tests are black-box integration tests per [testing.md](testing.md). No calling internal methods directly.

### Per ability type

| Type | Test Pattern |
|------|-------------|
| Passive modifier | Set up game state, trigger the system that queries the modifier, verify observable outcome |
| Component action | Choose "Component Action" → choose action ID → verify state change |
| Combat trigger | Move ships into enemy system → verify combat outcome |
| Transaction trigger | Set up neighbors, execute trade, verify trigger effect |
| Tech modifier | Use Technology strategy card, check available techs |

### Data tests

Faction data tests (ability exists, commodities count, starting techs) go in `factions.test.js`. Ability behavior tests go in `factionAbilities.test.js`.

---

## Faction Completion Checklist

For each faction:

1. **Data file** (`res/factions/<faction>.js`) — abilities, units, techs, leaders
2. **Data tests** (`factions.test.js`) — ability exists, starting units, commodities, techs
3. **Ability code** (`systems/factionAbilities.js`) — implement each ability
4. **Ability tests** (`factionAbilities.test.js`) — gameplay-based test per ability
5. **Commander unlock** — condition check in leader system

### Shared helper

```js
_hasAbility(player, abilityId)
```

Returns `true` if the player's faction has the specified ability. Use this instead of inline `player.faction?.abilities?.some(...)` checks.
