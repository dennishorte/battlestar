# Occupation Cards Implementation Batches

This file contains small batches (3-5 cards) for LLM agents to work on. 

## CRITICAL: Testing Requirements

**NEVER consider a card finished if the tests "still need work".** 

- All tests MUST pass before marking a card as complete
- If you cannot figure out how to test a card properly, **STOP and ask for assistance**
- Do NOT commit work with failing tests
- Do NOT mark cards as complete if tests are incomplete or failing

**After completing each batch, agents must:**
1. Ensure ALL tests pass for ALL cards in the batch
2. Update the status tracker (`occupation-cards-status.json`)
3. Re-read this file to get the next batch
4. Update progress metrics

This frequent context refresh keeps important details in working memory.

## Batch Status

- **Total Batches**: TBD (will be ~25-30 batches for Set A, ~80-140 total)
- **Completed Batches**: 9
- **Current Batch**: Batch-010

## Batch Queue

### Batch-001: Simple onPlay Resource Grants (Set A)
**Pattern**: Cards that grant resources when played (onPlay hook)  
**Template**: `AnimalTamer.js` (has onPlay + modifyHouseAnimalCapacity)  
**Test Template**: Create new tests following `Grocer.test.js` pattern  
**Complexity**: Simple (Tier 1)

Cards:
1. `animal-tamer-a086` - Animal Tamer (onPlay: choice of wood OR grain, also modifies house animal capacity)
2. `wood-carrier-a117` - Wood Carrier (onPlay: 1 wood per improvement)
3. `priest-a125` - Priest (onPlay: conditional - 3 clay, 2 reed, 2 stone if clay house with 2 rooms)

**LLM Instructions:**
1. Read each card file: `common/agricola/res/cards/occupationA/{CardName}.js`
2. Verify implementation matches card text exactly
3. Check if test file exists, create if missing
4. Create comprehensive test file for each card following `Grocer.test.js` pattern
5. **IMPORTANT: Turn Order Rules**:
   - Players alternate turns in the work phase
   - Each action space can only be used ONCE per round
   - If testing multiple actions by same player, use DIFFERENT action spaces
   - If testing "2nd person" effects, account for other players' turns between actions
6. Run tests: `npm test -- occupationA/AnimalTamer.test.js occupationA/WoodCarrier.test.js occupationA/Priest.test.js`
7. Fix any failures - **ALL tests must pass before marking complete**
8. Update `occupation-cards-status.json`:
   - Mark batch as completed
   - Update cardsCompleted count
   - Update cardsTested count
   - Set currentBatch to "Batch-002"
9. Re-read this file to get Batch-002 instructions

---

### Batch-002: Simple onPlay Resource Grants (Set A, continued)
**Pattern**: Cards that grant resources when played  
**Template**: `AnimalTamer.js`  
**Test Template**: Use Batch-001 tests as template  
**Complexity**: Simple (Tier 1)

Cards:
1. `firewood-collector-a118` - Firewood Collector
2. `catcher-a114` - Catcher
3. `mushroom-collector-a115` - Mushroom Collector

**LLM Instructions:**
1. Read each card file and verify implementation
2. Create test files following Batch-001 pattern
3. Run tests
4. Update status tracker
5. Move to Batch-003

---

### Batch-003: onPlay + onAction Resource Grants (Set A)
**Pattern**: Cards that grant resources on play AND when taking specific actions  
**Template**: `ClayPuncher.js`  
**Test Template**: Create based on pattern  
**Complexity**: Simple-Medium (Tier 1-2)

Cards:
1. `clay-puncher-a121` - Clay Puncher (onPlay + onAction for Lessons/Clay Pit)
2. `task-artisan-a096` - Task Artisan (onPlay + onStoneActionRevealed)
3. `scythe-worker-a112` - Scythe Worker (onPlay + onHarvest)

**LLM Instructions:**
1. Read each card file
2. Verify both hooks are implemented correctly
3. Create comprehensive tests covering both hooks
4. Run tests
5. Update status tracker
6. Move to Batch-004

---

### Batch-004: Simple onAction Resource Grants (Set A)
**Pattern**: Cards that grant resources when taking specific actions (onAction hook only, no onPlay)  
**Template**: `WoodCutter.js`  
**Test Template**: Use `ClayPuncher.test.js` as reference  
**Complexity**: Simple (Tier 1)

Cards:
1. `wood-cutter-a116` - Wood Cutter (onAction: +1 wood on wood accumulation spaces)
2. `pan-baker-a122` - Pan Baker (onAction: Grain Utilization → +2 clay, +1 wood)
3. `chief-forester-a115` - Chief Forester (onAction: wood accumulation → sow action)

**LLM Instructions:**
1. Read each card file and verify implementation
2. Create comprehensive test files following `ClayPuncher.test.js` pattern
3. Test onAction hook triggers for correct action spaces
4. Test that hook doesn't trigger for other actions
5. Run tests and fix any failures
6. Update status tracker
7. Move to Batch-005

---

### Batch-005: Cost Modification Cards (Set A) ✅ COMPLETED
**Pattern**: Cards that modify building/improvement costs  
**Template**: `Stonecutter.js`  
**Test Template**: Test with Farm Expansion (build room) action  
**Complexity**: Medium (Tier 2)

Cards:
1. `stonecutter-a143` - Stonecutter (modifyAnyCost: -1 stone for all costs) ✅
2. `frame-builder-a123` - Frame Builder (modifyBuildCost: allows wood substitution) ✅
3. `hedge-keeper-a088` - Hedge Keeper (modifyFenceCost: -3 wood for fences) ✅

**Status**: All cards implemented and tested. Frame Builder uses alternative cost pattern for wood substitution.

---

### Batch-006: onBuildRoom and onRenovate Hooks (Set A) ✅ COMPLETED
**Pattern**: Cards that trigger on room building or renovation  
**Template**: `Roughcaster.js`  
**Test Template**: Test with Farm Expansion and Renovation actions  
**Complexity**: Medium (Tier 2)

Cards:
1. `roughcaster-a110` - Roughcaster (onBuildRoom + onRenovate: +3 food for clay rooms/renovations) ✅
2. `wall-builder-a111` - Wall Builder (onBuildRoom: schedules food on next 4 rounds) ✅
3. `clay-hut-builder-a120` - Clay Hut Builder (onRenovate: when renovating from wood → schedules clay on next 5 rounds) ✅

**Status**: All cards implemented and tested. Clay Hut Builder uses onRenovate hook.

---

### Batch-007: onAction with Conditional Checks (Set A) ✅ COMPLETED
**Pattern**: Cards with onAction that have conditional logic  
**Template**: `Angler.js`, `BuildingExpert.js`  
**Test Template**: Test conditional logic and edge cases  
**Complexity**: Medium (Tier 2)

Cards:
1. `angler-a095` - Angler (onAction: Fishing with ≤2 food → improvement action) ✅
2. `building-expert-a163` - Building Expert (onAction: Resource Market → resource based on person number) ✅
3. `heresy-teacher-a113` - Heresy Teacher (onAction: Lessons → vegetables in fields with 3+ grain, uses underCrop mechanism) ✅

**Status**: All cards implemented and tested. Heresy Teacher uses underCrop field model for layered crops.

---

### Batch-008: onRoundStart and onReturnHome Hooks (Set A)
**Pattern**: Cards that trigger at round start or return home phase  
**Template**: `PlowDriver.js`  
**Test Template**: Test round start hooks and return home phase  
**Complexity**: Medium (Tier 2)

Cards:
1. `plow-driver-a090` - Plow Driver (onRoundStart: stone house → pay 1 food to plow)
2. `bohemian-a157` - Bohemian (onReturnHomeStart: unoccupied Lessons → +1 food)
3. `night-school-student-a152` - Night School Student (onReturnHome: no Lessons returns → play occupation for 1 food)

**LLM Instructions:**
1. Read each card file and verify hooks are implemented
2. For onRoundStart, test that hook fires at start of each round
3. For onReturnHome/onReturnHomeStart, play through a complete round to reach return home phase
4. Test conditional logic (e.g., Plow Driver requires stone house)
5. Run tests and fix any failures
6. Update status tracker
7. Move to Batch-009

---

### Batch-009: onHarvest and onHarvestEnd Hooks (Set A) ✅ COMPLETED
**Pattern**: Cards that trigger during harvest phases  
**Template**: `ScytheWorker.js`, `Ropemaker.js`  
**Test Template**: Test harvest phase hooks  
**Complexity**: Medium (Tier 2)

Cards:
1. `slurry-spreader-a106` - Slurry Spreader (onHarvestLastCrop: +2 food for grain, +1 for vegetables) ✅
2. `ropemaker-a145` - Ropemaker (onHarvestEnd: +1 reed at end of each harvest) ✅
3. `wood-harvester-a104` - Wood Harvester (onFieldPhase: +1 wood/food per wood accumulation space with 2/3+ wood) ✅

**Status**: All cards implemented and tested. Implemented `onHarvestLastCrop` hook wiring and `getWoodAccumulationSpaces` helper method.

---

### Batch-010: onPlayMinorFromHand and Special Action Hooks (Set A)
**Pattern**: Cards that trigger when playing improvements or special actions  
**Template**: `SmallTrader.js`, `Freshman.js`  
**Test Template**: Test improvement playing and special action hooks  
**Complexity**: Medium (Tier 2)

Cards:
1. `small-trader-a109` - Small Trader (onPlayMinorFromHand: +3 food when playing minor from hand)
2. `freshman-a097` - Freshman (onBakeBreadAction: can play occupation instead of baking - already tested, verify completeness)
3. `grocer-a102` - Grocer (onPlay: creates goods pile, anytime purchase - already tested, verify completeness)

**LLM Instructions:**
1. Read each card file and verify hooks are implemented
2. For Small Trader, test playing minor improvement from hand via action space
3. For Freshman, test Bake Bread action offering occupation choice
4. Verify hooks don't trigger inappropriately
5. Run tests and fix any failures
6. Update status tracker
7. Move to Batch-011

---

## Batch Creation Guidelines

When creating new batches:

1. **Keep batches small**: 3-5 cards maximum
2. **Group by pattern**: Cards with similar mechanics
3. **Start simple**: Tier 1 cards first, then Tier 2, etc.
4. **Use templates**: Reference existing implementations
5. **Include instructions**: Clear LLM agent guidance
6. **Require status updates**: Force context refresh after each batch

## Status Update Format

After each batch, update `occupation-cards-status.json`:

```json
{
  "lastUpdated": "2024-01-XX",
  "batchesCompleted": 3,
  "cardsCompleted": 12,
  "cardsTested": 12,
  "currentBatch": "Batch-004",
  "batches": {
    "Batch-001": {
      "status": "completed",
      "cards": ["animal-tamer-a086", "bed-maker-a093", "wood-carrier-a117"],
      "testsCreated": 3,
      "testsPassing": 3,
      "completedDate": "2024-01-XX"
    }
  }
}
```

## Next Steps

1. Complete Batch-001
2. Update status tracker
3. Re-read this file
4. Proceed to Batch-002
5. Continue until all batches complete
