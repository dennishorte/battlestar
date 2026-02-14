# Card State Migration Plan

## Overview

This document tracks the migration of all cards from storing state on the card definition (singleton) to using `game.cardState(id)` for per-game state storage.

## Problem

Card definitions are singleton module exports. Storing mutable state directly on the definition (e.g., `this.stored = 5`) causes state to leak between games and between tests, as the same object is reused across all game instances.

## Solution

Use `game.cardState(id)` which returns per-game state stored in `game.state._cardState[id]`. This ensures each game has its own isolated state for each card.

## Migration Status

### ✅ All Cards Migrated

All cards that store state have been migrated to use `game.cardState()`. The UI components have been updated to read from both:
1. **Primary**: `game.state._cardState[cardId]` (via `storedResource` pattern or direct access)
2. **Legacy**: `cardInstance.definition[resourceType]` (for backward compatibility)

### Cards Using `game.cardState()`

#### Minor Improvements (8 cards)
- ✅ **BeeStatue** - Uses `game.cardState(id).stack`
- ✅ **Cubbyhole** - Uses `game.cardState(id).stored` with `storedResource: "food"`
- ✅ **RomanPot** - Uses `game.cardState(id).stored` with `storedResource: "food"`
- ✅ **WhaleOil** - Uses `game.cardState(id).stored` with `storedResource: "food"`
- ✅ **PiggyBank** - Uses `game.cardState(id).stored` with `storedResource: "food"`
- ✅ **RodCollection** - Uses `game.cardState(id).stored` with `storedResource: "wood"`
- ✅ **Upholstery** - Uses `game.cardState(id).stored` with `storedResource: "reed"`
- ✅ **AshTrees** - Uses `game.cardState(id).storedFences`

#### Occupations (~33 cards)
- ✅ **AgriculturalLabourer** - Uses `game.cardState(id)`
- ✅ **Collector** - Uses `game.cardState(id).useCount`
- ✅ **MudWallower** - Uses `game.cardState(id).clay` and `game.cardState(id).boar`
- ✅ **PenBuilder** - Uses `game.cardState(id).wood`
- ✅ **WorkshopAssistant** - Uses `game.cardState(id).resourcePairs`
- ✅ **Omnifarmer** - Uses `game.cardState(id)`
- ✅ **MasterTanner** - Uses `game.cardState(id).food`
- ✅ **ResourceHoarder** - Uses `game.cardState(id).pile`
- ✅ **Wolf** - Uses `game.cardState(id).pile`
- ✅ **FieldCultivator** - Uses `game.cardState(id)`
- ✅ **SeedTrader** - Uses `game.cardState(id).grain` and `game.cardState(id).vegetables`
- ✅ **TreeInspector** - Uses `game.cardState(id).wood`
- ✅ **Emissary** - Uses `game.cardState(id).placedGoods`
- ✅ **Bonehead** - Uses `game.cardState(id)`
- ✅ **RetailDealer** - Uses `game.cardState(id)`
- ✅ **BeanCounter** - Uses `game.cardState(id).food`
- ✅ **Sequestrator** - Uses `game.cardState(id)`
- ✅ **Mason** - Uses `game.cardState(id).hasRoom`
- ✅ **DenBuilder** - Uses `game.cardState(id)`
- ✅ **FieldDoctor** - Uses `game.cardState(id).used`
- ✅ **Reseller** - Uses `game.cardState(id).used`
- ✅ **MasterBuilder** - Uses `game.cardState(id).used`
- ✅ **DeliveryNurse** - Uses `game.cardState(id).used`
- ✅ **Reader** - Uses `game.cardState(id)`
- ✅ **PartyOrganizer** - Uses `game.cardState(id)`
- ✅ **Carter** - Uses `game.cardState(id).activeRound`
- ✅ **Lazybones** - Uses `game.cardState(id).stables`
- ✅ **ClayCarrier** - Uses `game.cardState(id).lastUsedRound`
- ✅ **Butler** - Uses `game.cardState(id)`
- ✅ **EarthenwarePotter** - Uses `game.cardState(id)`
- ✅ **Dentist** - Uses `game.cardState(id).wood`
- ✅ **Entrepreneur** - Uses `game.cardState(id).food`
- ✅ **Wholesaler** - Uses `game.cardState(id)`

## State Storage Patterns

### Pattern 1: `storedResource` Pattern (Recommended)

For cards that store a single resource type:

```javascript
{
  storedResource: "food",  // or "wood", "reed", etc.
  onPlay(game, player) {
    game.cardState(this.id).stored = 0  // Initialize
  },
  onAction(game, player, actionId) {
    const s = game.cardState(this.id)
    s.stored = (s.stored || 0) + 1
  }
}
```

**UI Support**: ✅ Fully supported - UI automatically displays stored resources

**Examples**: WhaleOil, Cubbyhole, RomanPot, PiggyBank, RodCollection, Upholstery

### Pattern 2: Direct Resource Properties

For cards that store multiple resources or non-standard state:

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

**UI Support**: ⚠️ Partial - UI checks for common resource types but may need extension for custom properties

**Examples**: PenBuilder (wood), MudWallower (clay, boar), SeedTrader (grain, vegetables)

### Pattern 3: Pile/Stack Pattern

For cards that maintain a pile or stack:

```javascript
{
  onPlay(game, player) {
    game.cardState(this.id).pile = ['wood', 'grain', 'reed']
    // or
    game.cardState(this.id).stack = ['vegetables', 'stone', 'grain']
  }
}
```

**UI Support**: ✅ Fully supported - UI displays pile contents

**Examples**: ResourceHoarder (pile), BeeStatue (stack), Wolf (pile)

### Pattern 4: Used Flag

For cards that track one-time use:

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

**UI Support**: ✅ Fully supported - UI shows "✓ Already used" indicator

**Examples**: MasterBuilder, FieldDoctor, Reseller, DeliveryNurse

### Pattern 5: Custom State Properties

For cards with unique state requirements:

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

**UI Support**: ⚠️ Varies - Custom properties may not be displayed in UI

**Examples**: 
- Collector (useCount)
- Carter (activeRound)
- Mason (hasRoom)
- AshTrees (storedFences)
- WorkshopAssistant (resourcePairs)
- Emissary (placedGoods)

## UI Implementation

The UI components (`CardViewerModal.vue` and `AgricolaCardChip.vue`) have been updated to:

1. **Check `storedResource` pattern first**: If card has `storedResource`, read from `game.state._cardState[cardId].stored`
2. **Check legacy pattern**: Fall back to `cardInstance.definition[resourceType]` for backward compatibility
3. **Check pile/stack**: Read from `game.state._cardState[cardId].pile` or `definition.pile`
4. **Check used flag**: Read from `game.state._cardState[cardId].used` or `definition.used`

## Verification Checklist

To verify a card is properly migrated:

- [ ] Card uses `game.cardState(this.id)` instead of `this.property`
- [ ] State is initialized in `onPlay` hook
- [ ] All state reads/writes use `game.cardState(this.id)`
- [ ] If storing resources, consider using `storedResource` pattern for UI support
- [ ] Tests use `game.cardState(cardId)` to verify state
- [ ] UI displays state correctly (if applicable)

## Testing

All migrated cards should have tests that:
- Verify state is isolated per game instance
- Use `game.cardState(cardId)` to check state
- Don't rely on state persisting between tests

## Remaining Work

### None - All Cards Migrated! ✅

All cards that store state have been migrated to use `game.cardState()`. The UI has been updated to support both the new pattern and legacy patterns for backward compatibility.

## Future Considerations

1. **Remove legacy UI support**: Once we're confident no cards use the legacy pattern, we can remove the fallback checks in UI components
2. **Standardize on `storedResource`**: Consider migrating cards that store single resources to use the `storedResource` pattern for better UI support
3. **Custom state display**: For cards with complex state (like WorkshopAssistant's resourcePairs), consider adding custom UI display logic

## Related Files

- `common/agricola/agricola.js` - `cardState()` helper function (line 287)
- `app/src/modules/games/agricola/components/CardViewerModal.vue` - Card state display
- `app/src/modules/games/agricola/components/AgricolaCardChip.vue` - Compact card state display
- `app/src/modules/games/agricola/docs/card-state-display.md` - UI display documentation
