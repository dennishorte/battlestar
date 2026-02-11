# Anytime Actions

Anytime actions let players convert resources to food outside of the harvest
feeding phase. This covers cooking animals/vegetables via Fireplace or Cooking
Hearth, and card-based conversions from minor improvements with
`anytimeConversions`.

## When Anytime Actions Are Available

Anytime actions appear alongside **every** `choose()` prompt during a player's
turn. The `AgricolaActionManager.choose()` override intercepts all choice
requests, computes available anytime actions, and presents them in a side panel.
Players can execute multiple anytime actions before making their main choice.

During **harvest feeding**, a broader set of conversions is available (see
[Feeding Phase](#feeding-phase) below).

## Architecture

There are two parallel systems that share execution logic:

| System | Method | When | What it includes |
|--------|--------|------|------------------|
| Turn-time | `getAnytimeActions(player)` | Every `choose()` prompt | Cooking + card conversions |
| Harvest | `getAnytimeFoodConversionOptions(player)` | Feeding phase | Basic 1:1 + cooking + card conversions |

Both return arrays of option objects. Both are executed via
`executeAnytimeFoodConversion(player, option)`.

### Option Object Shape

```js
{
  type: 'basic' | 'cook' | 'cook-vegetable' | 'card-cook' | 'card-convert' | 'craft' | 'crop-move',
  resource: string,       // resource being consumed
  count: 1,               // always 1 (one conversion at a time)
  food: number,           // food produced
  description: string,    // display string for UI
  cardName?: string,      // for card-cook / card-convert
  improvement?: string,   // for craft
}
```

## Conversion Sources

### Basic Conversions (harvest only)

Always available during harvest feeding. Not available during turns.

| From | To | Rate |
|------|----|------|
| 1 grain | food | 1 |
| 1 vegetable | food | 1 |

Type: `basic`

### Major Improvement Cooking (Fireplace / Cooking Hearth)

Available anytime if the player has a major improvement with
`abilities.canCook: true`. Rates come from `abilities.cookingRates`.

**Fireplace** (clay cost 2 or 3):

| From | To | Rate |
|------|----|------|
| 1 sheep | food | 2 |
| 1 boar | food | 2 |
| 1 cattle | food | 3 |
| 1 vegetable | food | 2 |

**Cooking Hearth** (clay cost 4 or 5, upgrades from Fireplace):

| From | To | Rate |
|------|----|------|
| 1 sheep | food | 2 |
| 1 boar | food | 3 |
| 1 cattle | food | 4 |
| 1 vegetable | food | 3 |

Types: `cook` (animals), `cook-vegetable` (vegetables)

### Card-Based Conversions (anytimeConversions)

Minor improvements can define an `anytimeConversions` array. Each entry
specifies a `from` resource, `to` (always `'food'`), and `rate`.

```js
// Oriental Fireplace
anytimeConversions: [
  { from: "vegetables", to: "food", rate: 4 },
  { from: "sheep", to: "food", rate: 3 },
  { from: "cattle", to: "food", rate: 5 },
],
```

These are available both during turns and during harvest feeding.

Types: `card-cook` (animals), `card-convert` (non-animal resources)

### Harvest-Only Craft Conversions (harvestConversion)

Major improvements with `abilities.harvestConversion` provide a once-per-harvest
conversion of a building resource to food. These are added in
`allowFoodConversion()` only, not in `getAnytimeActions()`.

| Improvement | From | Food |
|-------------|------|------|
| Joinery | 1 wood | 2 |
| Pottery | 1 clay | 2 |
| Basketmaker's Workshop | 1 reed | 3 |

Type: `craft`

## Turn-Time Flow

```
AgricolaActionManager.choose(player, choices, opts)
  loop:
    compute anytimeActions = game.getAnytimeActions(player)
    present choices + anytimeActions to player (noAutoRespond if anytime exists)
    if player selects anytime action:
      game.executeAnytimeAction(player, action)
      continue loop  (re-present choices with updated resources)
    else:
      return player's main choice
```

Key details:

- `noAutoRespond: true` is set when anytime actions exist, preventing the
  auto-responder from submitting when there's only one main choice.
- The loop re-evaluates `getAnytimeActions()` each iteration since the player's
  resources change after each conversion.
- `choicesOrFn` can be a function, re-evaluated each loop iteration so that
  resource-dependent choices (e.g., affordability) update after conversions.

## Feeding Phase

During harvest feeding (`feedingPhase()`), there are two entry points for
conversions:

### 1. Pre-feeding Anytime Prompt

If the player already has enough food AND has anytime actions available, they
get a `"Feed family"` prompt. This prompt goes through `choose()`, which
attaches the anytime actions panel. The player can cook animals/convert
resources before confirming feeding.

```js
const hasAnytimeActions = this.getAnytimeActions(player).length > 0
if (hasAnytimeActions && player.food >= required) {
  this.actions.choose(player, ['Feed family'], { ... })
}
```

This is important because the Revised Edition rule automatically uses all food
tokens. Without this prompt, a player with a Fireplace and enough food would
have no opportunity to cook animals before feeding.

### 2. Conversion Loop (allowFoodConversion)

If the player doesn't have enough food, `allowFoodConversion()` enters a loop:

1. Compute `getAnytimeFoodConversionOptions(player)` (includes basic 1:1)
2. Add `craft` options from major improvements with `harvestConversion`
3. Present all options + "Done converting"
4. Execute selected conversion
5. Repeat until player has enough food or selects "Done converting"

The player can always choose "Done converting" to stop and take begging cards
for the shortfall.

## Baking (bakingConversion)

Baking is a **separate system** from anytime actions. Cards define a
`bakingConversion` property for grain-to-food conversion during "Bake Bread"
actions (Grain Utilization action space, Oven onBuy triggers).

```js
bakingConversion: { from: "grain", to: "food", rate: 2 }
```

Baking is triggered by `game.actions.bakeBread(player)` and is NOT available
as an anytime action. The distinction:

| Property | When available | Triggered by |
|----------|---------------|-------------|
| `anytimeConversions` | Any `choose()` prompt + harvest feeding | Player initiative |
| `bakingConversion` | "Bake Bread" action only | Grain Utilization, Oven purchase |
| `abilities.cookingRates` | Any `choose()` prompt + harvest feeding | Player initiative |
| `abilities.bakingRate` | "Bake Bread" action only | Grain Utilization, Oven purchase |

## Defining anytimeConversions on a Card

Add `anytimeConversions` as a top-level array on the card definition:

```js
module.exports = {
  id: "my-card-x001",
  name: "My Card",
  type: "minor",
  cost: { ... },
  anytimeConversions: [
    { from: "sheep", to: "food", rate: 3 },
    { from: "vegetables", to: "food", rate: 4 },
  ],
}
```

The engine scans `player.playedMinorImprovements` for cards with this property.
No hooks or engine wiring needed --- just define the array and the system picks
it up automatically.

For animal resources (`sheep`, `boar`, `cattle`), the engine checks
`player.getTotalAnimals(type)` and uses `player.removeAnimals()` to consume
them. For other resources, it checks `player[resourceKey]` and uses
`player.removeResource()`.

## Non-Food Anytime Actions

Some anytime actions don't convert resources to food. These are routed through
`executeAnytimeAction()` with a type-specific branch before the food conversion
delegation.

### Crop Move (`crop-move`)

Cards with `allowsAnytimeCropMove: true` (e.g., Clearing Spade) allow moving
1 crop from a field with 2+ crops to an empty field. This is a multi-step
interaction using nested `choose()` calls:

1. Player selects source field (must have `cropCount >= 2`)
2. Player selects target field (must be empty, i.e., `!crop || cropCount === 0`)
3. Source field `cropCount` decreases by 1; target gets `crop` type and `cropCount: 1`

The nested `choose()` calls go through the `AgricolaActionManager.choose()`
override, so the anytime actions panel remains available during sub-prompts.

**Field Phase Integration**: Before `harvestFields()`, players with a crop-move
anytime action get a "Harvest crops" prompt. This goes through `choose()` which
attaches the anytime actions panel, giving them a chance to rearrange crops
before harvest. The strategic value: moving a crop before harvest lets you
harvest from two fields instead of one, getting crops earlier.

```js
{
  type: 'crop-move',
  cardName: string,       // card providing the ability
  description: string,    // display string for UI
}
```

## Key Methods

| Method | File | Purpose |
|--------|------|---------|
| `getAnytimeActions(player)` | agricola.js | Turn-time options (cooking + cards + crop-move) |
| `getAnytimeFoodConversionOptions(player)` | agricola.js | All feeding options (basic + cooking + cards) |
| `executeAnytimeFoodConversion(player, option)` | agricola.js | Execute any conversion by type |
| `executeAnytimeAction(player, action)` | agricola.js | Routes crop-move, delegates food types |
| `executeAnytimeCropMove(player, action)` | agricola.js | Multi-step crop move between fields |
| `allowFoodConversion(player, required)` | agricola.js | Harvest feeding conversion loop |
| `choose(player, choices, opts)` | AgricolaActionManager.js | Override that injects anytime actions |
| `hasCookingAbility()` | AgricolaPlayer.js | Has major improvement with `canCook` |
| `getCookingImprovement()` | AgricolaPlayer.js | Returns improvement with cooking rates |
| `hasBakingAbility()` | AgricolaPlayer.js | Has baking improvement (major or minor) |
| `getBakingImprovement()` | AgricolaPlayer.js | Returns improvement with baking rate |

## Testing Anytime Actions

### Food Conversions

In E2E tests, anytime actions from minor improvements with `anytimeConversions`
appear during harvest feeding as choosable conversion options:

```js
t.choose(game, 'Oriental Fireplace: vegetables \u2192 4 food')
```

### Non-Food Actions (e.g., crop-move)

Non-food anytime actions must be triggered via `respondToInputRequest` with the
`anytime-action` shape, since they appear in the side panel rather than as
regular choices:

```js
function respondAnytimeAction(game, anytimeAction) {
  const request = game.waiting
  const selector = request.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: 'anytime-action', anytimeAction },
  })
}

// Trigger crop move during any choose() prompt
respondAnytimeAction(game, {
  type: 'crop-move',
  cardName: 'Clearing Spade',
  description: 'Clearing Spade: Move 1 crop to empty field',
})
t.choose(game, '2,0 (grain x3)')  // pick source field
t.choose(game, '2,1')              // pick target field
```

See `docs/testing.md` for the full testing guide.
