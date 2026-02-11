# Animal Placement

Animals (sheep, boar, cattle) live in specific locations on a player's farm.
Each location has capacity rules, and players must redistribute animals when
capacity is exceeded. This covers the placement system, auto-placement logic,
the placement modal, card-based holders, and breeding.

## Animal Locations

| Location | Capacity | Type Mixing | Notes |
|----------|----------|-------------|-------|
| House (pet) | 1 (modifiable) | Single type | `player.pet` stores the type |
| Pasture | 2 per space (doubled with stable) | Single type | Modified by Drinking Trough (+2/pasture) |
| Unfenced stable | 1 | Single type | `space.animal` on grid cells with `hasStable` |
| Card-based holder | Varies per card | Mixed types allowed | `player.cardAnimals[cardId]` storage |

## Capacity Rules

### Pastures

Base capacity = 2 per space in the pasture. A stable in a pasture doubles total
capacity. Card modifiers (e.g., Drinking Trough `modifyPastureCapacity` hook)
can further increase capacity.

```
capacity = spaces.length * 2
if (hasStable) capacity *= 2
capacity = applyPastureCapacityModifiers(pasture, capacity)
```

### House Pet

Default capacity is 1. The `applyHouseAnimalCapacityModifiers` hook allows
cards like Animal Tamer to increase this (e.g., 1 per room).

### Card-Based Holders

Cards with `holdsAnimalsPerPasture: true` hold 1 animal per pasture the player
owns. Unlike pastures, card holders allow **mixed types** (sheep, boar, and
cattle simultaneously). Storage is tracked in `player.cardAnimals`:

```js
player.cardAnimals = {
  'feedyard-b011': { sheep: 1, boar: 1, cattle: 0 }
}
```

For capacity calculations, each type's available capacity on a mixed-type holder
is the total capacity minus animals of other types already present:

```
availableFor[type] = totalCapacity - otherTypesOnCard
```

## Auto-Placement (`addAnimals`)

When a player gains animals (e.g., from Sheep Market), `addAnimals(type, count)`
places them automatically in priority order:

1. **Pastures with same type** - fill existing pastures of matching type
2. **Empty pastures** - assign type and fill
3. **Unfenced stables** - one animal per empty stable
4. **Pet slot** - if house is empty
5. **Card-based holders** - fill remaining capacity on holder cards

If `addAnimals` returns `false`, not all animals could be placed and the
placement modal is triggered.

## Overflow & Placement Modal

When animals exceed total capacity (e.g., after gaining animals or breeding),
the game triggers a `choose()` call with `type: 'animal-placement'`. The UI
presents the `AnimalPlacementModal`.

### Location Data Structure

`getAnimalPlacementLocations()` returns an array of location objects:

```js
{
  id: 'pasture-0',        // or 'house', 'stable-1-2', 'card-feedyard-b011'
  type: 'pasture',        // 'house', 'unfenced-stable', or 'card'
  name: 'Pasture (2 spaces)',
  currentAnimalType: 'sheep',  // null if empty (not used for card type)
  currentCount: 2,
  maxCapacity: 4,
  // Card-specific fields:
  mixedTypes: true,            // only on card locations
  currentAnimals: { sheep: 1, boar: 0, cattle: 0 },  // only on card locations
  cardId: 'feedyard-b011',     // only on card locations
}
```

### Availability Calculation

`getAnimalPlacementLocationsWithAvailability()` adds an `availableFor` map:

- **Standard locations**: available only for matching type (or any if empty)
- **Mixed-type locations**: available for all types (shared pool)

### Modal Response & Validation

The modal submits a plan via `applyAnimalPlacements(plan)`:

```js
{
  placements: [{ locationId, animalType, count }],
  overflow: { cook: { sheep: n }, release: { sheep: n } },
  incoming: { sheep: n, boar: n, cattle: n },
}
```

Validation rules:
1. Each location must have capacity for the placed animals
2. Non-mixed locations cannot hold multiple types
3. Non-mixed locations cannot receive a type different from current contents
4. Mixed-type locations check total count across all types vs. capacity
5. All incoming animals must be accounted for (placed + cooked + released)

Application order: place animals, then cook overflow (producing food), then
release remaining.

## Card-Based Holders

### Infrastructure

- **Storage**: `player.cardAnimals = { cardId: { sheep, boar, cattle } }`
- **Helper methods**:
  - `getCardAnimals(cardId)` - returns `{ sheep, boar, cattle }` counts
  - `getCardAnimalTotal(cardId)` - sum of all types on card
  - `addCardAnimal(cardId, type, count)` - add animals to card
  - `removeCardAnimal(cardId, type, count)` - remove animals from card
  - `getAnimalHoldingCards()` - returns all active cards with `holdsAnimalsPerPasture`

### Discovery

`getAnimalHoldingCards()` iterates `getActiveCards()` looking for
`holdsAnimalsPerPasture: true`. Returns:

```js
{ card, cardId, name, capacity, mixedTypes: true, animals: { sheep, boar, cattle } }
```

### Example: Feedyard (b011)

- Cost: 1 clay, 1 grain | VP: 1
- Capacity: 1 animal per pasture (dynamic)
- Mixed types: yes
- `onBreedingPhaseEnd`: +1 food per unused spot

## Breeding

### `breedAnimals()` Flow

For each animal type, if the player has >= 2 of that type and can place 1 more
(`canPlaceAnimals`), a baby is added via `addAnimals(type, 1)`.

### `onBreedingPhaseEnd` Hook

Called after all breeding resolves, once per player. Wired in
`breedingPhase()` via `callPlayerCardHook(player, 'onBreedingPhaseEnd')`.
Used by Feedyard to grant food for unused card spots.

## Scoring

`getTotalAnimals(type)` counts animals across all locations (pastures, unfenced
stables, pet, and card holders). This feeds into end-game scoring.

## Key Methods

| Method | File | Purpose |
|--------|------|---------|
| `getTotalAnimals(type)` | AgricolaPlayer.js | Count all animals of a type |
| `getTotalAnimalCapacity(type)` | AgricolaPlayer.js | Total capacity for a type |
| `canPlaceAnimals(type, count)` | AgricolaPlayer.js | Check if animals fit |
| `addAnimals(type, count)` | AgricolaPlayer.js | Auto-place animals |
| `removeAnimals(type, count)` | AgricolaPlayer.js | Remove animals |
| `getAnimalPlacementLocations()` | AgricolaPlayer.js | Location data for modal |
| `getAnimalPlacementLocationsWithAvailability()` | AgricolaPlayer.js | Locations with per-type availability |
| `applyAnimalPlacements(plan)` | AgricolaPlayer.js | Validate & apply modal plan |
| `getCardAnimals(cardId)` | AgricolaPlayer.js | Card animal counts |
| `getCardAnimalTotal(cardId)` | AgricolaPlayer.js | Total animals on a card |
| `addCardAnimal(cardId, type, count)` | AgricolaPlayer.js | Add animal to card |
| `removeCardAnimal(cardId, type, count)` | AgricolaPlayer.js | Remove animal from card |
| `getAnimalHoldingCards()` | AgricolaPlayer.js | Active cards that hold animals |
| `breedAnimals()` | AgricolaPlayer.js | Breed all eligible types |
| `breedingPhase()` | agricola.js | Orchestrate breeding + hooks |
