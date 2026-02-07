# Animal Overflow Handler - Improved UX Proposal

## Problem Statement

The current animal overflow handling is rudimentary:
1. Auto-places animals one at a time until capacity is reached
2. Asks a simple "Cook or Release?" question for remaining animals
3. Doesn't let players choose WHERE to place animals
4. Doesn't show available capacity across different locations
5. Doesn't allow strategic placement (e.g., saving pasture space for breeding)

## Proposed Solution

Create an `AnimalPlacementModal` that gives players full control over animal placement with a visual interface showing all available locations and their capacities.

## User Flow

1. Player takes an action that gives animals (e.g., Sheep Market with 3 sheep)
2. If `player.canPlaceAnimals(type, count)` returns false (or we want to always show the modal for better UX), open the modal
3. Modal displays:
   - **Incoming animals** section: Shows animals to place (e.g., "3 sheep to place")
   - **Locations table**: All placeable locations with current/max capacity
   - **Overflow section**: Animals that can't be placed, with cooking/release options
4. Player drags/clicks to assign animals to locations
5. Player clicks "Confirm" to submit the entire placement as a single action

## Modal Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Animal Placement                                          [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  INCOMING: 🐑 🐑 🐑 (3 sheep)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  AVAILABLE LOCATIONS                                            │
│  ┌──────────────────┬────────────┬─────────┬─────────────────┐ │
│  │ Location         │ Current    │ Capacity│ Place           │ │
│  ├──────────────────┼────────────┼─────────┼─────────────────┤ │
│  │ 🏠 House (pet)   │ -          │ 1       │ [+] 0 [-]       │ │
│  │ 🌾 Pasture 1     │ 2 sheep    │ 4       │ [+] 0 [-]       │ │
│  │ 🌾 Pasture 2     │ -          │ 8       │ [+] 0 [-]       │ │
│  │ 🏚️ Unfenced Stbl │ -          │ 1       │ [+] 0 [-]       │ │
│  └──────────────────┴────────────┴─────────┴─────────────────┘ │
│                                                                 │
│  OVERFLOW (1 sheep remaining)                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔥 Cook: 1 sheep → 2 food (Fireplace)                  │   │
│  │  ○ Cook all   ○ Release all   ○ Mix: [1] cook [0] rel   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Summary: Place 2 sheep, Cook 1 sheep (+2 food)                 │
│                                                                 │
│  [Cancel]                                        [Confirm]      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Structures

### Location Info (computed for modal)

```javascript
// From player.getAnimalPlacementLocations()
[
  {
    id: 'house',
    type: 'house',
    name: 'House (pet)',
    icon: '🏠',
    currentAnimalType: null,  // or 'sheep' if pet is sheep
    currentCount: 0,          // 0 or 1
    maxCapacity: 1,           // or more with Animal Tamer
    availableForType: {       // per animal type
      sheep: 1,
      boar: 1,
      cattle: 1,
    },
  },
  {
    id: 'pasture-0',
    type: 'pasture',
    name: 'Pasture (2 spaces)',
    icon: '🌾',
    spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }],
    hasStable: true,
    currentAnimalType: 'sheep',
    currentCount: 2,
    maxCapacity: 8,  // 2 spaces * 2 (base) * 2 (stable)
    availableForType: {
      sheep: 6,   // same type, 8 - 2 = 6
      boar: 0,    // different type, can't mix
      cattle: 0,
    },
  },
  {
    id: 'unfenced-stable-2-3',
    type: 'unfenced-stable',
    name: 'Unfenced Stable',
    icon: '🏚️',
    space: { row: 2, col: 3 },
    currentAnimalType: null,
    currentCount: 0,
    maxCapacity: 1,
    availableForType: {
      sheep: 1,
      boar: 1,
      cattle: 1,
    },
  },
]
```

### Placement Action (submitted to backend)

```javascript
{
  action: 'place-animals',
  placements: [
    { locationId: 'pasture-0', animalType: 'sheep', count: 2 },
    { locationId: 'house', animalType: 'sheep', count: 1 },
  ],
  overflow: {
    cook: { sheep: 1 },    // cook 1 sheep
    release: { sheep: 0 }, // release 0 sheep
  },
}
```

## Backend Changes

### New Methods in AgricolaPlayer.js

```javascript
// Get all locations where animals can be placed
getAnimalPlacementLocations() {
  const locations = []

  // House (pet slot)
  locations.push({
    id: 'house',
    type: 'house',
    name: 'House',
    currentAnimalType: this.pet,
    currentCount: this.pet ? 1 : 0,
    maxCapacity: this.applyHouseAnimalCapacityModifiers(1),
  })

  // Pastures
  for (const pasture of this.farmyard.pastures) {
    locations.push({
      id: `pasture-${pasture.id}`,
      type: 'pasture',
      name: `Pasture (${pasture.spaces.length} spaces)`,
      spaces: pasture.spaces,
      hasStable: this.pastureHasStable(pasture),
      currentAnimalType: pasture.animalType,
      currentCount: pasture.animalCount,
      maxCapacity: this.getPastureCapacity(pasture),
    })
  }

  // Unfenced stables
  for (const stable of this.getUnfencedStables()) {
    locations.push({
      id: `stable-${stable.row}-${stable.col}`,
      type: 'unfenced-stable',
      name: 'Unfenced Stable',
      space: stable,
      currentAnimalType: stable.animalType,
      currentCount: stable.animalCount,
      maxCapacity: 1,
    })
  }

  return locations
}

// Apply a placement plan (validates and executes)
applyAnimalPlacements(placements, overflow) {
  // Validate placements don't exceed capacity
  // Validate overflow matches remaining animals
  // Execute all placements
  // Execute cooking/releasing
  // Return success/failure with details
}
```

### New Methods in AgricolaActionManager.js

```javascript
// Replace handleAnimalOverflow with this
handleAnimalPlacement(player, animalType, count) {
  const locations = player.getAnimalPlacementLocations()
  const cookingRates = this.getCookingRates(player)

  // Calculate available capacity for this animal type
  const totalAvailable = locations.reduce((sum, loc) => {
    return sum + (loc.availableForType?.[animalType] || 0)
  }, 0)

  // If all animals fit and auto-place is preferred, just place them
  if (totalAvailable >= count && player.prefersAutoPlace) {
    player.addAnimals(animalType, count)
    return
  }

  // Otherwise, show the modal
  const result = this.choose(player, [], {
    type: 'animal-placement',
    animalType,
    count,
    locations,
    cookingRates,
  })

  // Apply the result
  player.applyAnimalPlacements(result.placements, result.overflow)

  // Log the result
  this.logAnimalPlacements(player, result)
}

getCookingRates(player) {
  const imp = player.getCookingImprovement()
  if (!imp) {
    return null  // No cooking available
  }
  return {
    improvement: imp.name,
    rates: imp.abilities.cookingRates,
  }
}
```

## Frontend Changes

### New Component: AnimalPlacementModal.vue

```vue
<template>
  <ModalBase id="animal-placement" size="lg" :closeable="false">
    <template #header>Place Animals</template>

    <div class="animal-placement-modal">
      <!-- Incoming Animals -->
      <div class="incoming-section">
        <h4>Incoming Animals</h4>
        <div class="animal-icons">
          <span v-for="i in incomingCount" :key="i" class="animal-icon">
            {{ animalEmoji }}
          </span>
          <span class="remaining-label">
            ({{ remainingToPlace }} {{ animalType }} to place)
          </span>
        </div>
      </div>

      <!-- Locations Table -->
      <div class="locations-section">
        <h4>Available Locations</h4>
        <table class="locations-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Current</th>
              <th>Capacity</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loc in locations" :key="loc.id" :class="{ disabled: !canPlaceAt(loc) }">
              <td>{{ loc.icon }} {{ loc.name }}</td>
              <td>{{ formatCurrent(loc) }}</td>
              <td>{{ loc.maxCapacity }}</td>
              <td>
                <button @click="decrement(loc)" :disabled="placements[loc.id] === 0">-</button>
                <span class="placement-count">{{ placements[loc.id] || 0 }}</span>
                <button @click="increment(loc)" :disabled="!canIncrement(loc)">+</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Overflow Section -->
      <div class="overflow-section" v-if="overflowCount > 0">
        <h4>Overflow ({{ overflowCount }} {{ animalType }})</h4>
        <div v-if="cookingRates">
          <p>🔥 Cook: {{ overflowCount }} {{ animalType }} → {{ cookingFood }} food ({{ cookingRates.improvement }})</p>
          <div class="overflow-options">
            <label><input type="radio" v-model="overflowChoice" value="cook"> Cook all</label>
            <label><input type="radio" v-model="overflowChoice" value="release"> Release all</label>
          </div>
        </div>
        <div v-else>
          <p>No cooking improvement - animals will be released</p>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary">
        <strong>Summary:</strong>
        Place {{ totalPlaced }} {{ animalType }}
        <span v-if="cookCount > 0">, Cook {{ cookCount }} (+{{ cookingFood }} food)</span>
        <span v-if="releaseCount > 0">, Release {{ releaseCount }}</span>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button class="btn btn-primary" @click="confirm" :disabled="!isValid">
          Confirm
        </button>
      </div>
    </div>
  </ModalBase>
</template>
```

## Validation Rules

1. **Placement validation:**
   - Cannot exceed location's available capacity for the animal type
   - Cannot place in a pasture that has a different animal type
   - House can only hold 1 pet (unless modified by cards)

2. **Total validation:**
   - `totalPlaced + cookCount + releaseCount === incomingCount`
   - Must account for all incoming animals

3. **Cooking validation:**
   - Can only cook if player has a cooking improvement
   - Cooking food calculation uses the best available rate

## Edge Cases

1. **No cooking improvement:** Only "Release" option shown for overflow
2. **All animals fit:** Modal could be skipped (optional setting)
3. **Mixed animal types:** Handle separately (e.g., Animal Market gives sheep + boar)
4. **Card effects:** Some cards modify capacity or cooking rates - ensure these are applied
5. **Breeding overflow:** Same modal, different trigger point

## Implementation Phases

### Phase 1: Backend Infrastructure
- Add `getAnimalPlacementLocations()` to AgricolaPlayer
- Add `applyAnimalPlacements()` validation and execution
- Update action manager to use new flow

### Phase 2: Frontend Modal
- Create `AnimalPlacementModal.vue`
- Add placement state management
- Wire up to game choice system

### Phase 3: Polish
- Add animations for animal movement
- Add "Auto-place" option for players who prefer the old behavior
- Add farmyard visualization in modal (visual placement on the grid)

## Testing

```javascript
describe('AnimalPlacementModal', () => {
  test('shows all available locations with correct capacities')
  test('prevents placing more than capacity allows')
  test('prevents placing in pasture with different animal type')
  test('calculates cooking food correctly')
  test('validates that all animals are accounted for')
  test('applies placements atomically')
  test('handles breeding overflow')
  test('respects card modifiers (Animal Tamer, etc.)')
})
```

## Design Decisions

1. **Auto-place:** Yes - skip modal when all animals fit automatically
2. **Visual placement:** Yes - show farmyard grid for visual click-to-place
3. **Multi-type:** Combined - handle multiple animal types in single modal
