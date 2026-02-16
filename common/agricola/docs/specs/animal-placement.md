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
| Card-based holder | Varies per card | Configurable | `player.cardAnimals[cardId]` storage |

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

Cards define animal-holding behavior via the `holdsAnimals` property. Storage
is tracked in `player.cardAnimals`:

```js
player.cardAnimals = {
  'feedyard-b011': { sheep: 1, boar: 1, cattle: 0 }
}
```

#### `holdsAnimals` Property Formats

| Format | Example | Capacity | Type Restriction |
|--------|---------|----------|-----------------|
| `holdsAnimalsPerPasture: true` | Feedyard | 1 per pasture (dynamic) | Mixed types |
| `holdsAnimals: N` | Stockyard (`3`) | Static number | `sameTypeOnly` flag controls mixing |
| `holdsAnimals: { type: N }` | Wildlife Reserve `{sheep:1, boar:1, cattle:1}`, Dolly's Mother `{sheep:1}` | Per-type static limits | Only listed types |
| `holdsAnimals: { type: true }` | Woolgrower `{sheep:true}`, Pet Broker `{sheep:true}` | Dynamic via `getAnimalCapacity(game, player)` | Only listed types |
| `holdsAnimals: { any: true }` | Livestock Feeder, Pen Builder | Dynamic via `getAnimalCapacity(game, player)` | Any type |
| `holdsAnimals: true` | Petting Zoo | Dynamic via `getAnimalCapacity(game, player)` | Any type (check `mixedAnimals`) |

#### Capacity Calculation by Type

- **Mixed-type holders** (`mixedTypes: true`): capacity shared across all types.
  `availableFor[type] = totalCapacity - otherTypesOnCard`
- **Per-type limits** (`perTypeLimits`): each type has its own independent limit.
  `availableFor[type] = perTypeLimits[type] - currentAnimals[type]`
- **Same-type-only** (`sameTypeOnly: true`): once a type is placed, only that
  type can be added. Other types see 0 availability.
- **Type-restricted** (`allowedTypes`): only listed types can be placed.
  Non-listed types always see 0 availability.

#### `getAnimalCapacity(game, player)` Convention

Cards with dynamic capacity define `getAnimalCapacity(game, player)` which
returns the current capacity as a number. All implementations use a uniform
`(game, player)` signature. Examples:

- Woolgrower: `game.getCompletedFeedingPhases()` (sheep count = feeding phases)
- Pet Broker: `player.getOccupationCount()` (1 sheep per occupation)
- Petting Zoo: `player.getRoomCount()` if `player.hasPastureAdjacentToHouse()`
- Livestock Feeder: `player.grain` (1 animal per grain in supply)
- Mud Wallower: `this.boar || 0` (tracks boar earned through clay conversion)

## Auto-Placement (`addAnimals`)

When a player gains animals (e.g., from Sheep Market), `addAnimals(type, count)`
places them automatically in priority order:

1. **Pastures with same type** - fill existing pastures of matching type
2. **Empty pastures** - assign type and fill
3. **Unfenced stables** - one animal per empty stable
4. **Pet slot** - if house is empty
5. **Card-based holders** - fill remaining capacity on holder cards

Card-based holders respect type restrictions during auto-placement:
- Cards with `allowedTypes` skip non-matching animal types
- `sameTypeOnly` cards skip if they already hold a different type
- `perTypeLimits` cards only add up to each type's individual limit

If `addAnimals` returns `false`, not all animals could be placed and the
placement modal is triggered.

### Forced Manual Placement

Cards with `forceManualAnimalPlacement: true` (e.g., Pet Grower) bypass
auto-placement and always show the placement modal when the player takes
animals from an accumulation space. This gives the player full control over
where animals go — for example, leaving the house pet slot empty to trigger
Pet Grower's bonus sheep.

In `takeAccumulatedResource`, active cards are checked for this flag. When
present, `handleAnimalPlacement` is called with `{ forceModal: true }` which
skips the auto-place loop and goes directly to the modal.

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
  currentAnimalType: 'sheep',  // null if empty
  currentCount: 2,
  maxCapacity: 4,
  // Card-specific fields:
  mixedTypes: true,            // whether multiple types can coexist
  sameTypeOnly: false,         // whether only one type allowed at a time
  allowedTypes: null,          // null (any) or ['sheep'] etc.
  perTypeLimits: null,         // null or { sheep: 1, boar: 1, cattle: 1 }
  currentAnimals: { sheep: 1, boar: 0, cattle: 0 },
  cardId: 'feedyard-b011',
}
```

### Availability Calculation

`getAnimalPlacementLocationsWithAvailability()` adds an `availableFor` map:

- **Standard locations**: available only for matching type (or any if empty)
- **Mixed-type locations**: available for all allowed types (shared pool)
- **Per-type limit locations**: each type has independent availability
- **Same-type-only locations**: only current type (or all if empty)
- **Type-restricted locations**: non-allowed types always get 0

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
5. Per-type limit locations validate each type against its specific limit
6. Same-type-only locations reject mixing different types
7. All incoming animals must be accounted for (placed + cooked + released)

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
  - `getAnimalHoldingCards()` - returns all active cards that hold animals

### Discovery

`getAnimalHoldingCards()` iterates `getActiveCards()` looking for cards with
`holdsAnimalsPerPasture` or `holdsAnimals` properties. Returns:

```js
{
  card,             // card object
  cardId,           // card ID string
  name,             // display name
  capacity,         // total capacity (number)
  mixedTypes,       // boolean — can hold multiple types simultaneously
  sameTypeOnly,     // boolean — once a type is placed, only that type
  allowedTypes,     // null (any) or ['sheep'] or ['sheep', 'boar', 'cattle']
  perTypeLimits,    // null or { sheep: 1, boar: 1, cattle: 1 }
  animals,          // { sheep: N, boar: N, cattle: N } current counts
}
```

### Examples

**Feedyard (b011)** — `holdsAnimalsPerPasture: true`
- Capacity: 1 animal per pasture (dynamic)
- Mixed types: yes
- `onBreedingPhaseEnd`: +1 food per unused spot

**Stockyard (b012)** — `holdsAnimals: 3`, `sameTypeOnly: true`
- Capacity: 3 (static)
- Same type only: once you place sheep, only sheep can go here

**Wildlife Reserve (c011)** — `holdsAnimals: { sheep: 1, boar: 1, cattle: 1 }`
- Per-type limits: 1 of each type
- Mixed types: yes (can hold all three simultaneously)

**Dolly's Mother (e084)** — `holdsAnimals: { sheep: 1 }`
- Per-type limits: 1 sheep only
- Boar and cattle cannot be placed here

**Pet Broker (b148)** — `holdsAnimals: { sheep: true }`
- Dynamic capacity: `player.getOccupationCount()` sheep
- Only sheep allowed

**Livestock Feeder (c086)** — `holdsAnimals: { any: true }`, `mixedAnimals: true`
- Dynamic capacity: `player.grain` (1 per grain)
- Any type, mixed

**Petting Zoo (e011)** — `holdsAnimals: true`, `mixedAnimals: true`
- Dynamic capacity: room count (if pasture adjacent to house)
- Any type, mixed

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
| `getAnimalsInHouse()` | AgricolaPlayer.js | Count animals in house pet slot (0 or 1) |
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
| `getPlayedOccupations()` | AgricolaPlayer.js | Card definitions for played occupations |
| `hasPastureAdjacentToHouse()` | AgricolaPlayer.js | Check for pasture next to room |
| `getAdjacentRoomPairCount()` | AgricolaPlayer.js | Count orthogonally adjacent room pairs |
| `getCompletedFeedingPhases()` | agricola.js | Number of completed feeding phases |
| `breedAnimals()` | AgricolaPlayer.js | Breed all eligible types |
| `breedingPhase()` | agricola.js | Orchestrate breeding + hooks |
