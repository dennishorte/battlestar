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
- **Completed Batches**: 17
- **Current Batch**: Batch-018

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

### Batch-010: onBuildImprovement and Special Action Hooks (Set A) ✅ COMPLETED
**Pattern**: Cards that trigger when playing improvements or special actions  
**Template**: `SmallTrader.js`, `Freshman.js`  
**Test Template**: Test improvement playing and special action hooks  
**Complexity**: Medium (Tier 2)

Cards:
1. `small-trader-a109` - Small Trader (onBuildImprovement: +3 food when playing minor improvement) ✅
2. `freshman-a097` - Freshman (onBakeBreadAction: can play occupation instead of baking) ✅
3. `grocer-a102` - Grocer (onPlay: creates goods pile, anytime purchase) ✅

**Status**: All cards implemented and tested. Small Trader uses `onBuildImprovement` hook with `card.type === 'minor'` check instead of separate `onPlayMinorFromHand` hook.

---

### Batch-011: Simple onAction Resource Bonuses (Set A) ✅ COMPLETED
**Pattern**: Cards that grant resources when taking specific actions  
**Template**: `ClayPuncher.js`, `SeasonalWorker.js`  
**Test Template**: Test action triggers and resource grants  
**Complexity**: Simple (Tier 1)

Cards:
1. `seasonal-worker-a114` - Seasonal Worker (onAction: +1 grain from Day Laborer, +1 vegetable from Round 6+) ✅
2. `portmonger-a103` - Portmonger (onAction: +1 vegetable/grain/reed when taking 1/2/3+ food from accumulation space) ✅
3. `barrow-pusher-a105` - Barrow Pusher (onPlowField: +1 clay and +1 food per new field) ✅

**Status**: All cards implemented and tested. Tests use setBoard, game.run(), t.choose, t.testBoard per testing spec.

---

### Batch-012: End Game Scoring Cards (Set A) ✅ COMPLETED
**Pattern**: Cards that score bonus points at end of game  
**Template**: `StableArchitect.js`, `FellowGrazer.js`  
**Test Template**: Test `getEndGamePoints` hook with various board states  
**Complexity**: Simple (Tier 1)

Cards:
1. `stable-architect-a098` - Stable Architect (getEndGamePoints: +1 VP per unfenced stable) ✅
2. `fellow-grazer-a099` - Fellow Grazer (getEndGamePoints: +2 VP per pasture with 3+ spaces) ✅
3. `cookery-outfitter-a101` - Cookery Outfitter (getEndGamePoints: +1 VP per cooking improvement) ✅

**Status**: All cards implemented and tested. Added `getPasturesWithMinSpaces` and `getCookingImprovementCount` to AgricolaPlayer.

---

### Batch-013: Room Capacity and Renovation Modifiers (Set A) ✅ COMPLETED
**Pattern**: Cards that modify room capacity, renovation rules, or building behavior  
**Template**: `Homekeeper.js`, `Conservator.js`, `BedMaker.js`  
**Test Template**: Test room capacity, renovation options, and build room hooks  
**Complexity**: Medium (Tier 2)

Cards:
1. `homekeeper-a085` - Homekeeper (modifyRoomCapacity: +1 person if room adjacent to field and pasture) ✅
2. `conservator-a087` - Conservator (allowDirectStoneRenovation: can renovate wood → stone directly) ✅
3. `bed-maker-a093` - Bed Maker (onBuildRoom: can pay 1 wood + 1 grain for family growth) ✅
4. `lodger-a127` - Lodger (providesRoom: temporary room until Round 9) ✅

**Status**: All cards implemented and tested. Added isRoomAdjacentToField, isRoomAdjacentToPasture, modifyRoomCapacity wiring in getHouseCapacity; offerBedMakerGrowth in ActionManager; getRoomCount respects providesRoomUntilRound.

---

### Batch-014: onBeforeAction Hooks (Set A) ✅ COMPLETED
**Pattern**: Cards that grant resources before taking actions based on round number  
**Template**: `Knapper.js`, `MasterWorkman.js`  
**Test Template**: Test `onBeforeAction` hook with different round cards  
**Complexity**: Medium (Tier 2)

Cards:
1. `knapper-a124` - Knapper (onBeforeAction: +1 stone when using round 5-7 action spaces)
2. `master-workman-a126` - Master Workman (onBeforeAction: +1 wood/clay/reed/stone for rounds 1/2/3/4)

**LLM Instructions:** (completed)
1. Read each card file and verify `onBeforeAction` implementation
2. Test with action spaces from different rounds
3. For Knapper, test rounds 5, 6, 7 (should trigger) and other rounds (should not)
4. For Master Workman, test rounds 1, 2, 3, 4 (different resources) and other rounds
5. Create comprehensive test files
6. Run tests and ensure ALL pass before marking complete
7. Update `occupation-cards-status.json` after completion

---

### Batch-015: Phase Hooks (Set A) ✅ COMPLETED
**Pattern**: Cards that trigger during specific game phases  
**Template**: `Treegardener.js`, `Curator.js`  
**Test Template**: Test phase hooks (onFieldPhase, onReturnHome)  
**Complexity**: Medium (Tier 2)

Cards:
1. `treegardener-a118` - Treegardener (onFieldPhase: +1 wood, can buy up to 2 more for 1 food each)
2. `curator-a100` - Curator (onReturnHome: can buy 1 bonus point for 1 food if 3+ workers from accumulation spaces)

**LLM Instructions:** (completed)
1. Read each card file and verify phase hook implementation
2. For Treegardener, test field phase trigger and optional wood purchase
3. For Curator, test return home phase with 3+ workers from accumulation spaces
4. Create comprehensive test files
5. Run tests and ensure ALL pass before marking complete
6. Update `occupation-cards-status.json` after completion

---

### Batch-016: Special Action Modifiers and Flags (Set A) ✅ COMPLETED
**Pattern**: Cards that modify action rules or provide special abilities  
**Template**: `AdoptiveParents.js`, `StablePlanner.js`, `ShiftingCultivator.js`, `LazySowman.js`  
**Test Template**: Test special action modifiers and flags  
**Complexity**: Medium-High (Tier 2-3)

Cards:
1. `adoptive-parents-a092` - Adoptive Parents (allowImmediateOffspringAction: can use offspring same round)
2. `stable-planner-a089` - Stable Planner (onPlay: schedule free stables on rounds +3, +6, +9)
3. `shifting-cultivator-a091` - Shifting Cultivator (onAction: can pay 3 food to plow when using wood accumulation space)
4. `lazy-sowman-a094` - Lazy Sowman (onDeclineSow: can place extra person on occupied space)

**LLM Instructions:**
1. Read each card file and verify implementation
2. For Adoptive Parents, test immediate offspring action capability
3. For Stable Planner, test scheduled free stables on correct rounds
4. For Shifting Cultivator, test wood accumulation space trigger and optional plow
5. For Lazy Sowman, test declining sow action and extra person placement
6. Create comprehensive test files
7. Run tests and ensure ALL pass before marking complete
8. Update `occupation-cards-status.json` after completion

---

### Batch-017: onAnyAction Hooks (Set A) ✅ COMPLETED
**Pattern**: Cards that trigger when other players take specific actions  
**Template**: `RiparianBuilder.js`, `Publican.js`  
**Test Template**: Test `onAnyAction` and `onAnyBeforeSow` hooks with other players' actions  
**Complexity**: Medium (Tier 2)

Cards:
1. `riparian-builder-a128` - Riparian Builder (onAnyAction: can build room when other player uses Reed Bank, discount for clay/stone)
2. `publican-a132` - Publican (onAnyBeforeSow: can give 1 grain to get 1 bonus point when other player sows)

**LLM Instructions:**
1. Read each card file and verify implementation
2. For Riparian Builder, test with other player using Reed Bank action space
3. For Publican, test with other player taking sow action
4. Create comprehensive test files
5. Run tests and ensure ALL pass before marking complete
6. Update `occupation-cards-status.json` after completion

---

### Batch-018: Build Hooks and Complex onAction (Set A)
**Pattern**: Cards that trigger on building improvements or have complex onAction logic  
**Template**: `CraftTeacher.js`, `Swagman.js`, `RiverineShepherd.js`  
**Test Template**: Test `onBuildMajor` and complex onAction behavior  
**Complexity**: Medium-High (Tier 2-3)

Cards:
1. `craft-teacher-a131` - Craft Teacher (onBuildMajor: can play 2 free occupations after building Joinery/Pottery/Basketmaker's Workshop)
2. `swagman-a129` - Swagman (onAction: can use Farm Expansion/Grain Seeds with same person after using the other)
3. `riverine-shepherd-a137` - Riverine Shepherd (onAction: can take from other accumulation space when using Sheep Market/Reed Bank)

**LLM Instructions:**
1. Read each card file and verify implementation
2. For Craft Teacher, test building each of the three major improvements
3. For Swagman, test using Farm Expansion then Grain Seeds (and vice versa)
4. For Riverine Shepherd, test taking from other accumulation space
5. Create comprehensive test files
6. Run tests and ensure ALL pass before marking complete
7. Update `occupation-cards-status.json` after completion

---

### Batch-019: Special Flags and Modifiers (Set A)
**Pattern**: Cards with special flags or modifiers  
**Template**: `MummysBoy.js`  
**Test Template**: Test special flags and modifiers  
**Complexity**: Medium (Tier 2)

Cards:
1. `mummys-boy-a130` - Mummy's Boy (allowsDoubleAction: can reuse action space with 3rd+ person)

**LLM Instructions:**
1. Read card file and verify flag implementation
2. Test double action capability with 3rd+ person
3. Test action space marking/reuse
4. Create comprehensive test file
5. Run tests and ensure ALL pass before marking complete
6. Update `occupation-cards-status.json` after completion

---

### Batch-020: onPlay + End Game Scoring (Set A)
**Pattern**: Cards that grant resources on play and score at end of game  
**Template**: `FullFarmer.js`, `AnimalReeve.js`, `DrudgeryReeve.js`  
**Test Template**: Test `onPlay` resource grants and `getEndGamePoints`/`getEndGamePointsAllPlayers`  
**Complexity**: Medium-High (Tier 2-3)

Cards:
1. `full-farmer-a134` - Full Farmer (onPlay: +1 wood +1 clay, getEndGamePoints: +1 VP per full pasture)
2. `animal-reeve-a135` - Animal Reeve (onPlay: wood based on rounds left, getEndGamePointsAllPlayers: bonus for players with 2+/3+/4+ of each animal)
3. `drudgery-reeve-a136` - Drudgery Reeve (onPlay: wood based on rounds left, getEndGamePointsAllPlayers: bonus for players with 1+/2+/3+ of each building resource)

**LLM Instructions:**
1. Read each card file and verify both `onPlay` and end game scoring
2. For Full Farmer, test resource grant and full pasture scoring
3. For Animal Reeve, test wood grant based on rounds left and all-player scoring
4. For Drudgery Reeve, test wood grant and all-player scoring
5. Create comprehensive test files
6. Run tests and ensure ALL pass before marking complete
7. Update `occupation-cards-status.json` after completion

---

### Batch-021: Complex End Game Scoring (Set A)
**Pattern**: Cards with complex end game scoring logic  
**Template**: `Braggart.js`  
**Test Template**: Test complex `getEndGamePoints` with various thresholds  
**Complexity**: Medium (Tier 2)

Cards:
1. `braggart-a133` - Braggart (getEndGamePoints: 2/3/4/5/7/9 VP for 5/6/7/8/9/10+ improvements)

**LLM Instructions:**
1. Read card file and verify `getEndGamePoints` implementation
2. Test various improvement counts (5, 6, 7, 8, 9, 10+)
3. Test that it only works in 3+ player games
4. Create comprehensive test file
5. Run tests and ensure ALL pass before marking complete
6. Update `occupation-cards-status.json` after completion

---

### Batch-022: Accumulation Space onAction Hooks (Set A)
**Pattern**: Cards that grant bonuses when using accumulation spaces  
**Template**: `Harpooner.js`, `ShovelBearer.js`, `StorehouseSteward.js`  
**Test Template**: Test onAction hooks with accumulation spaces  
**Complexity**: Medium (Tier 2)

Cards:
1. `harpooner-a138` - Harpooner (onAction: can pay 1 wood when using Fishing to get food per person + 1 reed)
2. `shovel-bearer-a140` - Shovel Bearer (onAction: +food equal to clay on other clay accumulation space)
3. `storehouse-steward-a146` - Storehouse Steward (onAction: +1 stone/reed/clay/wood when taking 2/3/4/5 food)

**LLM Instructions:**
1. Read each card file and verify implementation
2. For Harpooner, test Fishing action with wood payment
3. For Shovel Bearer, test Clay Pit/Hollow with clay on other space
4. For Storehouse Steward, test different food amounts (2, 3, 4, 5)
5. Create comprehensive test files
6. Run tests and ensure ALL pass before marking complete
7. Update `occupation-cards-status.json` after completion

---

### Batch-023: Phase Hooks and checkTriggers (Set A)
**Pattern**: Cards that trigger at phase start or use checkTriggers  
**Template**: `TurnipFarmer.js`, `Sequestrator.js`  
**Test Template**: Test phase hooks and checkTriggers  
**Complexity**: Medium-High (Tier 2-3)

Cards:
1. `turnip-farmer-a141` - Turnip Farmer (onReturnHomeStart: +1 vegetable if Day Laborer and Grain Seeds both occupied)
2. `sequestrator-a144` - Sequestrator (onPlay: place resources on card, checkTriggers: award when conditions met)

**LLM Instructions:**
1. Read each card file and verify implementation
2. For Turnip Farmer, test return home phase with both spaces occupied
3. For Sequestrator, test resource placement and trigger conditions (3 pastures, 5 fields)
4. Create comprehensive test files
5. Run tests and ensure ALL pass before marking complete
6. Update `occupation-cards-status.json` after completion

---

### Batch-024: onAnyAction with Resource Conditions (Set A)
**Pattern**: Cards that trigger on other players' actions with resource conditions  
**Template**: `Cordmaker.js`  
**Test Template**: Test onAnyAction with resource amount conditions  
**Complexity**: Medium (Tier 2)

Cards:
1. `cordmaker-a142` - Cordmaker (onAnyAction: can take 1 grain or buy 1 vegetable when any player takes 2+ reed)

**LLM Instructions:**
1. Read card file and verify `onAnyAction` implementation
2. Test with other player taking 2+ reed from Reed Bank
3. Test choice between grain and vegetable purchase
4. Create comprehensive test file
5. Run tests and ensure ALL pass before marking complete
6. Update `occupation-cards-status.json` after completion

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
