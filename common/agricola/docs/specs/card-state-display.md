# Card State Display in UI

## Overview

Some Agricola cards accumulate state during gameplay (counters, stored resources, piles, etc.). This document explains how card state is represented and displayed in the UI.

## Card State Storage Patterns

**All cards use `game.cardState(id)` for per-game state storage.** This ensures state is isolated per game instance and doesn't leak between games or tests.

### Pattern 1: `storedResource` Pattern (Recommended for Single Resource)

Cards that store a single resource type use the `storedResource` property. This pattern provides automatic UI support:

```javascript
{
  id: "whale-oil-e051",
  storedResource: "food",  // Indicates what type of resource is stored
  onAction(game, player, actionId) {
    if (actionId === 'fishing') {
      const s = game.cardState(this.id)
      s.stored = (s.stored || 0) + 1  // Amount stored in game.cardState(id).stored
    }
  }
}
```

**Examples:**
- Whale Oil (`storedResource: "food"`) - stores food counters
- Cubbyhole (`storedResource: "food"`) - stores food counters
- Roman Pot (`storedResource: "food"`) - stores food counters
- Piggy Bank (`storedResource: "food"`) - stores food counters
- Upholstery (`storedResource: "reed"`) - stores reed counters
- Rod Collection (`storedResource: "wood"`) - stores wood counters

**Storage Location:** `game.state._cardState[cardId].stored`  
**UI Support:** ✅ Fully supported - automatically displayed with resource icon

### Pattern 2: Direct Resource Properties

Cards that store multiple resources or non-standard state use direct properties:

```javascript
{
  onPlay(game, player) {
    const s = game.cardState(this.id)
    s.wood = 0
    s.food = 0
  },
  onAction(game, player, actionId) {
    const s = game.cardState(this.id)
    s.wood = (s.wood || 0) + 1
  }
}
```

**Examples:**
- Pen Builder - stores `wood` for animal capacity
- Mud Wallower - stores `clay` and `boar` counts
- Seed Trader - stores `grain` and `vegetables` separately
- Tree Inspector - stores `wood` for discounts

**Storage Location:** `game.state._cardState[cardId][resourceType]`  
**UI Support:** ⚠️ Partial - UI checks for common resource types (food, wood, clay, stone, reed, grain, vegetables)

### Pattern 3: Pile/Stack Pattern

Cards that maintain a pile or stack of items:

```javascript
{
  onPlay(game, player) {
    game.cardState(this.id).pile = ['wood', 'grain', 'reed']
    // or
    game.cardState(this.id).stack = ['vegetables', 'stone', 'grain']
  }
}
```

**Examples:**
- Resource Hoarder - uses `pile` array
- Bee Statue - uses `stack` array
- Wolf - uses `pile` array
- Grocer - uses `goods` array

**Storage Location:** `game.state._cardState[cardId].pile` or `.stack` or `.goods` (array)  
**UI Support:** ✅ Fully supported - displays pile contents with icons

### Pattern 4: Used Flag

Cards that track one-time use:

```javascript
{
  onPlay(game, player) {
    game.cardState(this.id).used = false
  },
  canUse() {
    return !game.cardState(this.id).used
  }
}
```

**Examples:**
- Master Builder - tracks if room-building ability used
- Field Doctor - tracks if healing ability used
- Reseller - tracks if exchange ability used
- Delivery Nurse - tracks if animal delivery used

**Storage Location:** `game.state._cardState[cardId].used` (boolean)  
**UI Support:** ✅ Fully supported - shows "✓ Already used" indicator

### Pattern 5: Custom State Properties

Cards with unique state requirements:

```javascript
{
  onPlay(game, player) {
    const s = game.cardState(this.id)
    s.useCount = 0
    s.activeRound = game.state.round + 1
    s.hasRoom = true
    s.storedFences = 5
    s.resourcePairs = []
    s.placedGoods = []
  }
}
```

**Examples:**
- Collector - uses `useCount` for tracking action space uses
- Carter - uses `activeRound` for delayed effects
- Mason - uses `hasRoom` for room tracking
- Ash Trees - uses `storedFences` for fence storage
- Workshop Assistant - uses `resourcePairs` for improvement tracking
- Emissary - uses `placedGoods` for good tracking

**Storage Location:** `game.state._cardState[cardId][customProperty]`  
**UI Support:** ⚠️ Varies - Custom properties may not be displayed in UI unless specifically added

## UI Components

### CardViewerModal

The card viewer modal displays detailed card state when viewing a card:
- Shows stored resources with icons
- Shows pile contents
- Shows used status

**Location:** `app/src/modules/games/agricola/components/CardViewerModal.vue`

### AgricolaCardChip

The card chip component displays a compact view of card state in lists:
- Shows resource badges (e.g., "3🍞" for 3 food)
- Shows pile indicator (📦N)
- Shows used indicator (✓)

**Location:** `app/src/modules/games/agricola/components/AgricolaCardChip.vue`

## Implementation Details

Both components check for card state in this order:

1. **`storedResource` pattern** (Primary): If card has `storedResource` property, read from `game.state._cardState[cardId].stored`
2. **Direct resource properties**: Check `game.state._cardState[cardId][resourceType]` for common resources (food, wood, clay, stone, reed, grain, vegetables)
3. **Legacy fallback**: Check `cardInstance.definition[resourceType]` for backward compatibility (should not be needed as all cards are migrated)
4. **Pile/Stack**: Check `game.state._cardState[cardId].pile` or `.stack` or `.goods`, with fallback to `definition.pile`
5. **Used flag**: Check `game.state._cardState[cardId].used`, with fallback to `definition.used`

**Note:** All cards have been migrated to use `game.cardState()`. The legacy fallback is maintained for safety but should not be needed.

## Adding New Card State Types

When implementing a new card that needs to display state:

1. **For single resource storage**: Use `storedResource` pattern (recommended)
   ```javascript
   {
     storedResource: "food",  // or "wood", "reed", etc.
     onPlay(game, player) {
       game.cardState(this.id).stored = 0  // Initialize
     },
     // Store amount in game.cardState(this.id).stored
   }
   ```
   **Benefits:** Automatic UI support, clear intent, standardized pattern

2. **For multiple resources**: Store directly in `game.cardState()`
   ```javascript
   {
     onPlay(game, player) {
       const s = game.cardState(this.id)
       s.food = 0
       s.wood = 0
     }
   }
   ```
   **Note:** UI will automatically display common resource types (food, wood, clay, stone, reed, grain, vegetables)

3. **For complex state**: Store in `game.cardState()` and extend UI if needed
   ```javascript
   {
     onPlay(game, player) {
       const s = game.cardState(this.id)
       s.customProperty = initialValue
     }
   }
   ```
   **Note:** Custom properties may need UI component updates to display

**Important:** Always use `game.cardState(this.id)` - never store state directly on the card definition object (it's a singleton and will leak between games).

## Testing

To verify card state display:

1. Play a card that accumulates state (e.g., Whale Oil)
2. Trigger the accumulation (e.g., use Fishing action)
3. Check that the card chip shows the resource badge
4. Click the card to open CardViewerModal
5. Verify the "Current State" section shows the stored resources

## Migration Status

✅ **All cards have been migrated** to use `game.cardState()` for state storage. No cards store state directly on the definition object.

See `common/agricola/docs/plans/card-state-migration-plan.md` for complete migration details and list of all migrated cards.

## Cards with Specialized Display Needs

The following cards have state that could benefit from specialized display logic beyond the standard patterns:

### High Priority

#### Workshop Assistant (`workshop-assistant-c146`)
**Current State:** `resourcePairs` - Array of `{ improvement: cardId, resources: [type1, type2] }`  
**Current Display:** "Pairs: 3" (count only)  
**Recommended Enhancement:** Show resource pair details
- **Option 1:** "Pairs: 3 (🪵🧱, 🪨🌿, 🪵🪨)" - compact inline display
- **Option 2:** Expandable list showing which improvements have which pairs
- **Benefit:** Players can see which resource pairs are available without opening the card modal

#### Emissary (`emissary-d124`)
**Current State:** `placedGoods` - Array of good types (e.g., `['wood', 'grain']`)  
**Current Display:** "Goods: 2" (count only)  
**Recommended Enhancement:** Show which goods are placed
- **Display:** "Goods: 🪵🌾" - show icons of placed goods
- **Benefit:** Players can see what goods are available for exchange

### Medium Priority

#### Mud Wallower (`mud-wallower-c148`)
**Current State:** 
- `clay` - stored in cardState (displayed as resource)
- `boar` - stored in cardState (displayed as custom state)
- Animals may also be stored via `cardAnimals`  
**Current Display:** "On card: 2🧱" and "Boar: 🐗1"  
**Note:** The `boar` in cardState represents boar earned through clay conversion, which may differ from actual animals on the card. Consider clarifying the distinction or consolidating display.

#### Pen Builder (`pen-builder-e086`)
**Current State:**
- `wood` - stored in cardState (displayed as resource)
- Animals stored via `cardAnimals`  
**Current Display:** "On card: 3🪵" and "Animals: 🐑2 🐗1"  
**Note:** The wood count directly relates to animal capacity (wood × 2). Could show: "On card: 3🪵 (capacity: 6 animals)"

#### Seed Trader (`seed-trader-d114`)
**Current State:** `grain` and `vegetables` - stored in cardState  
**Current Display:** "On card: 2🌾 2🥕"  
**Note:** These represent goods available for purchase. Could enhance with: "On card: 2🌾 (2🍞 each) 2🥕 (3🍞 each)" to show costs.

### Low Priority

#### Collector (`collector-c104`)
**Current State:** `useCount` - tracks action space uses (0-4)  
**Current Display:** "Uses: 2/4"  
**Status:** ✅ Adequate - shows progress clearly

#### Ash Trees (`ash-trees-e074`)
**Current State:** `storedFences` - number of fences stored  
**Current Display:** "Fences: 🪵3"  
**Status:** ✅ Adequate - clear and concise

#### Mason (`mason-c087`)
**Current State:** `hasRoom` - boolean tracking room status  
**Current Display:** "Room: ✓" or "Room: ✗"  
**Status:** ✅ Adequate - clear boolean display

#### Carter (`carter-e088`)
**Current State:** `activeRound` - round when effect activates  
**Current Display:** "Active: R5"  
**Status:** ✅ Adequate - shows when effect will trigger

## Future Enhancements

### Generic Custom State Display System

Currently, custom state properties are hardcoded per card ID. Consider implementing a more generic system:

**Option 1: Card Definition Metadata**
```javascript
{
  id: "workshop-assistant-c146",
  stateDisplay: {
    resourcePairs: {
      label: 'Pairs',
      format: 'count',  // or 'list', 'compact'
      showDetails: true
    }
  }
}
```

**Option 2: Display Helper Functions**
```javascript
{
  id: "workshop-assistant-c146",
  formatStateDisplay(cardState) {
    return {
      resourcePairs: {
        label: 'Pairs',
        value: cardState.resourcePairs.length,
        details: cardState.resourcePairs.map(p => `${p.resources.join('')}`).join(', ')
      }
    }
  }
}
```

**Benefits:**
- Cards define their own display format
- No UI changes needed for new cards
- Consistent display patterns
- Easier to maintain

### Expandable State Section

For cards with complex state, consider making the state section expandable:
- Default: Show summary (e.g., "Pairs: 3")
- Expanded: Show full details (e.g., list of all pairs with improvements)
- Similar to how card description expands

### State Icons and Colors

Consider adding visual indicators:
- Different colors for different state types
- Icons for state categories (resources, counters, flags)
- Progress indicators for count-based state (e.g., Collector uses)

## Implementation Status

See `app/src/modules/games/agricola/docs/card-state-display-implementation.md` for detailed implementation status and testing checklist.

## Related Files

- `common/agricola/agricola.js` - `cardState()` helper function (line 287)
- `common/agricola/docs/plans/card-state-migration-plan.md` - Complete migration plan and card list
- `app/src/modules/games/agricola/docs/card-state-display-implementation.md` - Implementation details and status
- `common/agricola/res/cards/minorE/WhaleOil.js` - Example of `storedResource` pattern
- `common/agricola/res/cards/minorE/Cubbyhole.js` - Example of `storedResource` pattern
- `common/agricola/res/cards/occupationE/PenBuilder.js` - Example of direct resource properties
- `common/agricola/res/cards/occupationE/ResourceHoarder.js` - Example of pile pattern
- `app/src/modules/games/agricola/components/CardViewerModal.vue` - Detailed card view
- `app/src/modules/games/agricola/components/AgricolaCardChip.vue` - Compact card display
