# Card State Display Implementation

## Current Implementation Status

The `AgricolaCardChip` component now displays card state in a separate section below the main chip. This document details what is displayed and what might need special rendering.

## ✅ Fully Supported State Types

### 1. `storedResource` Pattern (Single Resource)
**Status:** ✅ Fully supported  
**Display:** "On card: 3🍞"  
**Examples:** Whale Oil, Cubbyhole, Roman Pot, Piggy Bank, Rod Collection, Upholstery

### 2. Direct Resource Properties (Multiple Resources)
**Status:** ✅ Fully supported (fixed)  
**Display:** "On card: 2🪵 3🧱"  
**Examples:** 
- Pen Builder (wood)
- Mud Wallower (clay - note: boar shown separately as custom state)
- Seed Trader (grain, vegetables)

**Note:** Fixed to read from `game.cardState(id)[resourceType]` instead of only checking definition.

### 3. Pile/Stack Pattern
**Status:** ✅ Fully supported  
**Display:** "Pile: 📦5 🪵🌾🌿..." (shows count and preview of top 3 items)  
**Examples:** Resource Hoarder, Bee Statue, Wolf, Grocer

### 4. Used Flag
**Status:** ✅ Fully supported  
**Display:** "✓ Used"  
**Examples:** Master Builder, Field Doctor, Reseller, Delivery Nurse

### 5. Animals on Cards
**Status:** ✅ Fully supported  
**Display:** "Animals: 🐑2 🐗1 🐄3"  
**Examples:** Pen Builder, Mud Wallower, Livestock Feeder, Pet Broker, etc.

**Storage:** `player.cardAnimals[cardId]` (not in cardState)

## ⚠️ Partially Supported (Custom State)

The following custom state properties are displayed with special rendering:

### Collector - `useCount`
**Display:** "Uses: 2/4"  
**Status:** ✅ Supported

### Ash Trees - `storedFences`
**Display:** "Fences: 🪵3"  
**Status:** ✅ Supported

### Mason - `hasRoom`
**Display:** "Room: ✓" or "Room: ✗"  
**Status:** ✅ Supported

### Carter - `activeRound`
**Display:** "Active: R5"  
**Status:** ✅ Supported

### Workshop Assistant - `resourcePairsCount`
**Display:** "Pairs: 3"  
**Status:** ✅ Supported (shows count only, not details)

### Emissary - `placedGoodsCount`
**Display:** "Goods: 2"  
**Status:** ✅ Supported (shows count only, not which goods)

### Mud Wallower - `boar` (from cardState)
**Display:** "Boar: 🐗2"  
**Status:** ✅ Supported (note: this is different from animals stored via `cardAnimals`)

## ❌ Not Currently Displayed

The following state properties exist but are not displayed:

### Complex Structures
- **Workshop Assistant `resourcePairs`**: Array of `{ improvement, resources }` objects
  - **Recommendation:** Could show as "Pairs: 3 (on 3 improvements)" or expand to show details
- **Emissary `placedGoods`**: Array of good types
  - **Recommendation:** Could show as "Goods: 🪵🌾" (icons of placed goods)

### Numeric Counters (Could Add)
- **Lazybones `stables`**: Object tracking stable positions
  - **Recommendation:** Could show as "Stables: 2" if we can count them
- **Tree Inspector `wood`**: Already shown as resource, but could show discount info
- **Clay Carrier `lastUsedRound`**: Not useful to display (internal tracking)

### Boolean Flags (Could Add)
- **Mason `hasRoom`**: ✅ Already supported
- Other boolean flags are typically internal and not user-facing

## Recommendations

### High Priority
1. **Workshop Assistant**: Show resource pairs in more detail
   - Could show: "Pairs: 3 (🪵🧱, 🪨🌿, 🪵🪨)" or expandable list
2. **Emissary**: Show which goods are placed
   - Could show: "Goods: 🪵🌾" instead of just count

### Medium Priority
3. **Generic Custom State Display**: Create a more generic system for displaying custom properties
   - Instead of hardcoding each card, could have a mapping or convention
   - Cards could define how to display their state

### Low Priority
4. **Complex State Expansion**: For cards with complex state, consider making the state section expandable
   - Similar to how card description expands
   - Would allow showing full details without cluttering the default view

## Implementation Notes

### Current Approach
- Custom state is hardcoded per card ID
- Each custom property has its own template section
- Works well for known cards but doesn't scale automatically

### Alternative Approach (Future)
Could create a more generic system:
```javascript
// Card definition could include display hints
{
  stateDisplay: {
    useCount: { label: 'Uses', format: '{value}/4' },
    storedFences: { label: 'Fences', icon: '🪵' }
  }
}
```

This would allow cards to define their own display format without UI changes.

## Testing Checklist

To verify state display works correctly:

- [ ] Whale Oil: Use Fishing → shows "On card: 1🍞"
- [ ] Pen Builder: Place wood → shows "On card: 3🪵"
- [ ] Seed Trader: Shows "On card: 2🌾 2🥕"
- [ ] Resource Hoarder: Shows "Pile: 📦6 🪨🧱..."
- [ ] Mud Wallower: Use accumulation → shows "On card: 2🧱" and "Boar: 🐗1"
- [ ] Pen Builder: Place animals → shows "Animals: 🐑2 🐗1"
- [ ] Collector: Use action space → shows "Uses: 1/4"
- [ ] Ash Trees: Play card → shows "Fences: 🪵5"
- [ ] Master Builder: Use ability → shows "✓ Used"

## Related Files

- `app/src/modules/games/agricola/components/AgricolaCardChip.vue` - Main implementation
- `app/src/modules/games/agricola/docs/card-state-display.md` - User-facing documentation
- `common/agricola/docs/plans/card-state-migration-plan.md` - Migration details
