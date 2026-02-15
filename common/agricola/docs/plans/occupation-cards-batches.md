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

**Implementation rule – no one-off action manager methods:**  
When implementing or revising cards, **do not add one-off methods to the action manager** (e.g. `offerCordmakerChoice`, `offerPaymasterBonus`) for card-specific behavior. Instead, **inline the implementation on the card** (e.g. in the card’s hook, call `player.addResource`, `game.log.add`, `game.actions.choose`, or existing shared helpers). Use action manager methods only for **shared** behavior used by multiple cards or core flow. This rule applies to all batches.

## Batch Status

- **Set A**: 30 batches, all complete (Batch-030 was final).
- **Set B**: 20 batches (Batch-B01 through Batch-B20), 84 cards. Start with Batch-B01.
- **Current Batch**: Set-A-Complete; when starting Set B, set to Batch-B01.

### Next Set of Batches (025–030) – Summary
| Batch   | Theme | Cards | Notes |
|---------|--------|-------|--------|
| 025 | Simple onAction + capacity | Conjurer, Patch Caretaker, Woolgrower | 3 cards |
| 026 | onAnyAction pay/give for bonus or good | Paymaster, Buyer, Joiner of the Sea | Engine: offerPaymasterBonus, offerBuyerPurchase, offerJoinerOfTheSeaTrade |
| 027 | Traveling Players cluster | House Artist, Stagehand, Culinary Artist, Lutenist | 4 cards; engine: build discount/choice, culinary exchange, offerBuyVegetable |
| 028 | checkTrigger + onReturnHomeStart | Pig Owner, Minstrel | 2 cards; engine: getUnoccupiedActionSpacesInRounds |
| 029 | Animal purchase on action | Animal Dealer, Animal Teacher | offerBuyAnimal; Animal Teacher inlined |
| 030 | Created space, exchanges, build/round/harvest | Forest Tallyman, Wood Worker, Breeder Buyer, Pig Breeder, Haydryer | 5 cards; engine: gap space, offerWoodForSheepExchange, offerBuyCattle, onBuildRoomAndStable |

These six batches cover the remaining **19 occupationA cards** that are implemented but not yet tested. After Batch-030, Set A will have full test coverage for all implemented cards.

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

### Batch-018: Build Hooks and Complex onAction (Set A) ✅ COMPLETED
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

### Batch-019: Special Flags and Modifiers (Set A) ✅ COMPLETED
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

### Batch-020: onPlay + End Game Scoring (Set A) ✅ COMPLETED
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

### Batch-021: Complex End Game Scoring (Set A) ✅ COMPLETED
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

### Batch-022: Accumulation Space onAction Hooks (Set A) ✅ COMPLETED
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

### Batch-023: Phase Hooks and checkTriggers (Set A) ✅ COMPLETED
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

### Batch-025: Simple onAction and Capacity Modifiers (Set A)
**Pattern**: Single-hook onAction resource grants; card that holds animals with dynamic capacity  
**Template**: `Conjurer.js`, `PatchCaretaker.js`, `Woolgrower.js`  
**Test Template**: Use accumulation-space tests (e.g. StorehouseSteward) for onAction; capacity tests for holdsAnimals  
**Complexity**: Simple–Medium (Tier 1–2)

Cards:
1. `conjurer-a155` - Conjurer (onAction: Traveling Players → +1 wood, +1 grain)
2. `patch-caretaker-a161` - Patch Caretaker (onAction: 2nd+ use of same good-type accumulation this phase → +1 vegetable)
3. `woolgrower-a148` - Woolgrower (holdsAnimals: sheep; getAnimalCapacity = completed feeding phases)

**LLM Instructions:**
1. Read each card file and verify implementation
2. Conjurer: test using Traveling Players gives wood and grain
3. Patch Caretaker: test using two accumulation spaces of same good type in one work phase gives vegetable on second
4. Woolgrower: test that sheep capacity on card equals completed feeding phases (may need multi-round setup)
5. Create comprehensive test files; run tests and update status

---

### Batch-026: onAnyAction – Pay/Give for Bonus or Good (Set A)
**Pattern**: When another player uses a space, card owner pays/gives something for a bonus or good  
**Template**: `Paymaster.js`, `Buyer.js`, `JoinerOfTheSea.js`  
**Test Template**: RiparianBuilder / Cordmaker style (other player takes action, owner gets offer)  
**Complexity**: Medium (Tier 2). **Engine**: Verify/add `offerPaymasterBonus`, `offerBuyerPurchase`, `offerJoinerOfTheSeaTrade` in AgricolaActionManager.

Cards:
1. `paymaster-a154` - Paymaster (another uses food accumulation → give 1 grain for 1 bonus point)
2. `buyer-a156` - Buyer (another uses reed/stone/sheep/boar space → pay them 1 food to get 1 good from supply)
3. `joiner-of-the-sea-a159` - Joiner of the Sea (another uses Fishing/Reed Bank → give 1 wood to get 2/3 food)

**LLM Instructions:**
1. Locate or implement offerPaymasterBonus, offerBuyerPurchase, offerJoinerOfTheSeaTrade
2. Test with 3–4 players; other player uses the trigger space, owner gets the offer
3. Test choice/skip and resource/point outcomes
4. Create comprehensive test files; run tests and update status

---

### Batch-027: Traveling Players – onAction and onAnyAction (Set A)
**Pattern**: Cards that trigger on “Traveling Players” accumulation space (owner or another player)  
**Template**: `HouseArtist.js`, `Stagehand.js`, `CulinaryArtist.js`, `Lutenist.js`  
**Test Template**: Use Traveling Players in setBoard; test owner vs other-player triggers  
**Complexity**: Medium (Tier 2). **Engine**: Verify/add `offerBuildRoomsWithDiscount`, `offerBuildChoice`, `offerCulinaryArtistExchange`; `offerBuyVegetable` may already exist or be similar to New Purchase.

Cards:
1. `house-artist-a149` - House Artist (onAction: you use Traveling Players → Build Rooms with 1 reed discount)
2. `stagehand-a150` - Stagehand (onAnyAction: another uses Traveling Players → your choice: Build Fences / Stables / Rooms)
3. `culinary-artist-a158` - Culinary Artist (onAnyAction: another uses Traveling Players → exchange 1 grain/sheep/vegetable for 4/5/7 food)
4. `lutenist-a160` - Lutenist (onAnyAction: another uses Traveling Players → +1 food +1 wood, then optional buy 1 vegetable for 2 food)

**LLM Instructions:**
1. Ensure Traveling Players action space is available in tests (round/actionSpaces)
2. Implement or verify engine methods for build-with-discount, build choice, culinary exchange, buy vegetable
3. Test owner vs other-player triggers; test skip and resource outcomes
4. Create comprehensive test files; run tests and update status

---

### Batch-028: checkTrigger and onReturnHomeStart (Set A)
**Pattern**: checkTrigger (e.g. first-time condition); onReturnHomeStart with conditional use of action space  
**Template**: `PigOwner.js`, `Minstrel.js`  
**Test Template**: Braggart/Sequestrator for checkTrigger; custom for “use unoccupied space”  
**Complexity**: Medium (Tier 2). **Engine**: `getUnoccupiedActionSpacesInRounds(min, max)` added; Minstrel inlined (choose Use/Skip then executeAction).

Cards:
1. `pig-owner-a153` - Pig Owner (checkTrigger: first time you have 5 wild boar → 3 bonus points)
2. `minstrel-a151` - Minstrel (onReturnHomeStart: if exactly one action space in rounds 1–4 is unoccupied, you may use it)

**LLM Instructions:**
1. Pig Owner: test reaching 5 boar triggers 3 BP once; test no second trigger
2. Minstrel: test round where only one space in 1–4 is unoccupied; owner gets offer to use it
3. Create comprehensive test files; run tests and update status

✅ COMPLETED

---

### Batch-029: Animal Purchase on Action (Set A) ✅ COMPLETED
**Pattern**: Buy animal(s) when using a specific action space (market or Lessons)  
**Template**: `AnimalDealer.js`, `AnimalTeacher.js`  
**Test Template**: Use offerBuyAnimal pattern; Lessons action space for Animal Teacher  
**Complexity**: Medium (Tier 2). **Engine**: `offerBuyAnimal` used for Animal Dealer; Animal Teacher inlined (0/1/2 food for sheep/boar/cattle, all Lessons).

Cards:
1. `animal-dealer-a147` - Animal Dealer (onAction: Sheep/Pig/Cattle Market → may buy 1 additional animal of that type for 1 food)
2. `animal-teacher-a168` - Animal Teacher (onAction: after Lessons → may buy 1 sheep/boar/cattle for 0/1/2 food)

**LLM Instructions:**
1. Verify offerBuyAnimal supports “additional animal for 1 food” for Animal Dealer
2. Implement or verify offerBuyAnimalTeacher with 0/1/2 food choice
3. Test with appropriate accumulation/market and Lessons spaces
4. Create comprehensive test files; run tests and update status

---

### Batch-030: Created Action Space, Exchanges, and Build/Round/Harvest Hooks (Set A) ✅ COMPLETED
**Pattern**: createsActionSpace; onAction exchange; onBuildRoomAndStable; onPlay + onRoundEnd; onBeforeHarvest  
**Template**: `ForestTallyman.js`, `WoodWorker.js`, `BreederBuyer.js`, `PigBreeder.js`, `Haydryer.js`  
**Test Template**: Work Certificate / created-space tests; build + stable in one turn; round 12 / before-harvest hooks  
**Complexity**: Medium–High (Tier 2–3). **Engine**: Verify created action space “gap”, `offerWoodForSheepExchange`, `offerBuyCattle`; ensure `onBuildRoomAndStable` and `onRoundEnd(12)` are invoked.

Cards:
1. `forest-tallyman-a162` - Forest Tallyman (createsActionSpace when Forest and Clay Pit occupied; use gap → 2 clay, 3 wood)
2. `wood-worker-a164` - Wood Worker (onAction: take wood → may exchange 1 wood for 1 sheep, place wood on space)
3. `breeder-buyer-a167` - Breeder Buyer (onBuildRoomAndStable: build room + stable same turn → 1 sheep/boar/cattle by room type)
4. `pig-breeder-a165` - Pig Breeder (onPlay: 1 boar; onRoundEnd(12): boar breed if 2+ and room)
5. `haydryer-a166` - Haydryer (onBeforeHarvest: may buy 1 cattle for 4 − pastures food, min 0)

**LLM Instructions:**
1. Forest Tallyman: test gap space appears when Forest and Clay Pit occupied; use it for 2 clay, 3 wood
2. Wood Worker: test take-wood then exchange 1 wood for 1 sheep (wood on space)
3. Breeder Buyer: test building room + stable in same turn grants correct animal
4. Pig Breeder: test onPlay boar and round 12 breeding
5. Haydryer: test before-harvest cattle purchase with pasture discount
6. Create comprehensive test files; run tests and update status

---

### After Batch-030 – Set A complete

Set A (occupationA) has full test coverage for all implemented cards. Set B (occupationB) batches are defined below. **Status**: Start with Batch-B01; update `occupation-cards-status.json` after each batch.

---

## Set B (occupationB) – 84 cards in 20 batches

**Note:** Some Set B cards already have tests (e.g. Sheep Walker, Salter, Silokeeper). Verify and extend tests per batch; ensure all tests pass before marking a batch complete. No one-off action-manager methods: keep card logic on the card.

| Batch   | Theme | Cards | Notes |
|---------|--------|-------|--------|
| B01 | Simple onPlay | Groom, Established Person, Consultant, Field Merchant, Case Builder | 5 |
| B02 | onPlay placement/choice | Confidant, Tree Farm Joiner, Roof Ballaster, Patch Caregiver, Seducer | 5 |
| B03 | onPlay by state | Shoreforester, Lumberjack, Estate Worker, House Steward, Forest Guardian | 5 |
| B04 | onPlay animal/special | Pet Broker, Open Air Farmer, Little Peasant, Art Teacher | 4 |
| B05 | onPlay animal | Sheep Whisperer, Stable Sergeant | 2 |
| B06 | onAction Day Laborer/single | Cottager, Assistant Tiller, Cooperative Plower, Little Stick Knitter, Silokeeper | 5 |
| B07 | onAction accumulation | Geologist, Mineralogist, Oven Firing Boy, Collier, Equipper | 5 |
| B08 | onAction Grain/wood | Greengrocer, Cattle Feeder, Forest Clearer, Storehouse Keeper, Huntsman | 5 |
| B09 | onAction build/major | Illusionist, Full Peasant, Large Scale Farmer, Junior Artist, Plumber | 5 |
| B10 | onBeforeAction | Sweep, Stock Protector | 2 |
| B11 | checkTrigger | Manservant, Pastor, Sheep Keeper | 3 |
| B12 | onBuildRoom/onHarvest | Rustic, Furniture Carpenter, Estate Master | 3 |
| B13 | onAnyAction/phase | Clay Warden, Pub Owner, Wholesaler | 3 |
| B14 | onRoundStart | Childless, Scholar, Nutrition Expert, Small Scale Farmer, Moral Crusader | 5 |
| B15 | Phase end | Informant, District Manager, Farmyard Worker, Pavior, Forest Scientist | 5 |
| B16 | Passive cost/ability | Carpenter, Master Bricklayer, Brushwood Collector, Farm Hand | 4 |
| B17 | Scoring | Organic Farmer, Clutterer, Housemaster, Housebook Master, Trimmer | 5 |
| B18 | Anytime/field/harvest | Lieutenant General, Weakling, Game Provider, Pasture Master, Salter | 5 |
| B19 | Scoring/passive | Sheep Walker, Village Peasant, Seatmate, Tutor, Paper Maker | 5 |
| B20 | Remaining | Tinsmith Master, Truffle Searcher | 2 |

---

### Batch-B01: Simple onPlay resource grants (Set B)
**Pattern**: onPlay – immediate resources or renovate  
**Template**: Set A `Grocer.test.js` / `AnimalTamer.test.js`  
**Complexity**: Tier 1

Cards:
1. `groom-b089` - Groom (onPlay: 1 wood; once stone house, bonus)
2. `established-person-b088` - Established Person (onPlay: if exactly 2 rooms, renovate free)
3. `consultant-b102` - Consultant (onPlay: get 2 grain/3 clay/2 stone/1 reed by player count)
4. `field-merchant-b103` - Field Merchant (onPlay: 1 wood, 1 reed; each decline "Market" → 1 food)
5. `case-builder-b105` - Case Builder (onPlay: 1 good of each type if you have 0 of that type)

**LLM Instructions:** Verify onPlay grants; test Field Merchant decline-Market trigger; Case Builder conditional goods. Create tests; run; update status.

---

### Batch-B02: onPlay with placement or choice (Set B)
**Pattern**: onPlay – place on round spaces or choose bonus  
**Template**: Set A placement/choice tests  
**Complexity**: Tier 1–2

Cards:
1. `confidant-b093` - Confidant (onPlay: place 1 food on each of next 2/3/4 round spaces; at start of those rounds get food)
2. `tree-farm-joiner-b096` - Tree Farm Joiner (onPlay: place wood on round spaces)
3. `roof-ballaster-b123` - Roof Ballaster (onPlay: pay 1 food to get 1 stone per room)
4. `patch-caregiver-b113` - Patch Caregiver (onPlay: buy 1 grain for 1 food OR 1 vegetable for 3 food)
5. `seducer-b127` - Seducer (onPlay: immediate effect per card text)

**LLM Instructions:** Test round-space placement and collection; Patch Caregiver choice. Create tests; run; update status.

---

### Batch-B03: onPlay resources by game state (Set B) ✅ COMPLETED
**Pattern**: onPlay – resources based on rounds, fences, or board state  
**Complexity**: Tier 2

Cards:
1. `shoreforester-b116` - Shoreforester (onPlay + onReedBankReplenish) ✅
2. `lumberjack-b119` - Lumberjack (onPlay: place 1 wood on each of next N round spaces, N = fences) ✅
3. `estate-worker-b125` - Estate Worker (onPlay: place 1 wood, 1 clay, 1 reed, 1 stone on next 4 round spaces) ✅
4. `house-steward-b136` - House Steward (onPlay: if 1/3/6/9 complete rounds left, get 1/2/3/4 wood; scoring: most rooms → 3 BP) ✅
5. `forest-guardian-b138` - Forest Guardian (onPlay: 2 wood; onAnyAction: other player takes 5+ wood → pays 1 food) ✅

**Status**: All cards tested. Fixed Shoreforester to only trigger on empty Reed Bank (was missing wasNonEmpty guard). Fixed Forest Guardian to use onAnyAction instead of nonexistent onAnyBeforeAction hook; expanded wood action ID list.

---

### Batch-B04: onPlay animal or special (Set B) ✅ COMPLETED
**Pattern**: onPlay – animals or unique effect  
**Complexity**: Tier 2

Cards:
1. `pet-broker-b148` - Pet Broker (onPlay: 1 sheep; holdsAnimals capacity = occupation count) ✅
2. `open-air-farmer-b149` - Open Air Farmer (onPlay: if ≥3 stables in supply, build 2-space pasture for 2 wood, remove 3 stables) ✅
3. `little-peasant-b151` - Little Peasant (onPlay: 1 stone; canUseOccupiedActionSpace when 2 wood rooms, except Meeting Place) ✅
4. `art-teacher-b155` - Art Teacher (onPlay: 1 wood + 1 reed; canUseTravelingPlayersFood for occupation costs) ✅

**Status**: All cards tested. Fixed Little Peasant to use canUseOccupiedActionSpace hook (was using nonexistent ignoresOccupancy wiring). Fixed Open Air Farmer to inline pasture building (was calling nonexistent offerOpenAirFarmerPasture). Wired canUseTravelingPlayersFood in playOccupation for Art Teacher. Added skipCost/skipCostCheck options to buildPasture/validatePastureSelection.

---

### Batch-B05: onPlay animal (Set B) ✅ COMPLETED
**Pattern**: onPlay – animal grants  
**Complexity**: Tier 1

Cards:
1. `sheep-whisperer-b164` - Sheep Whisperer (onPlay: schedules sheep at round+2,+5,+8,+10) ✅
2. `stable-sergeant-b167` - Stable Sergeant (onPlay: pay 2 food for 1 sheep, 1 boar, 1 cattle if capacity) ✅

**Status**: All cards tested. Added scheduledSheep delivery to collectScheduledResources. Inlined StableSergeant offer logic (was using nonexistent offerStableSergeantAnimals).

---

### Batch-B06: onAction – Day Laborer / single space (Set B) ✅ COMPLETED
**Pattern**: onAction when using Day Laborer, Farmland, or Sheep Market  
**Template**: Set A `Cottager`-style tests  
**Complexity**: Tier 1–2

Cards:
1. `cottager-b087` - Cottager (onAction: Day Laborer → build 1 room or renovate) ✅
2. `assistant-tiller-b091` - Assistant Tiller (onAction: Day Laborer → plow 1 field) ✅
3. `cooperative-plower-b090` - Cooperative Plower (onAction: Farmland while Grain Seeds occupied → bonus plow) ✅
4. `little-stick-knitter-b092` - Little Stick Knitter (onAction: from Round 5, Sheep Market → Family Growth with Room) ✅
5. `silokeeper-b112` - Silokeeper (onAction: pre-harvest round action space → 1 grain) ✅ (pre-existing)

**Status**: All cards tested. Inlined Cottager build/renovate offer (was calling nonexistent offerCottagerBuild). CooperativePlower switched to use existing offerPlow. LittleStickKnitter switched to use existing familyGrowth. Silokeeper already had 3 passing tests.

---

### Batch-B07: onAction – accumulation spaces (wood/clay/reed) (Set B) ✅ COMPLETED
**Pattern**: onAction when taking wood, clay, reed, or stone from accumulation  
**Complexity**: Tier 2

Cards:
1. `geologist-b121` - Geologist (onAction: Forest/Reed Bank → +1 clay; 3p+ Clay Pit too) ✅
2. `mineralogist-b122` - Mineralogist (onAction: clay accumulation → +1 stone; stone → +1 clay) ✅
3. `oven-firing-boy-b108` - Oven Firing Boy (onAction: wood accumulation → Bake Bread) ✅
4. `collier-b144` - Collier (onAction: Clay Pit → +1 reed, +1 wood; 3p+ adds +1 to Hollow) ✅
5. `equipper-b131` - Equipper (onAction: wood accumulation → play minor improvement) ✅

**Status**: All cards tested. Fixed game.players.count() → game.players.all().length in Geologist/Collier. OvenFiringBoy switched to existing bakeBread. Equipper switched to existing buyMinorImprovement. Collier fixed Hollow ID (was take-clay-2, corrected to hollow).

---

### Batch-B08: onAction – Grain Seeds, markets, wood (Set B) ✅ COMPLETED
**Pattern**: onAction for Grain Seeds, markets, or wood amount  
**Complexity**: Tier 2

Cards:
1. `greengrocer-b142` - Greengrocer (onAction: Grain Seeds → also 1 vegetable) ✅
2. `cattle-feeder-b166` - Cattle Feeder (onAction: Grain Seeds → also buy 1 cattle for 1 food) ✅
3. `forest-clearer-b162` - Forest Clearer (onAction: obtain exactly 2/3/4 wood from wood space → +1 wood) ✅
4. `storehouse-keeper-b156` - Storehouse Keeper (onAction: Resource Market → 1 clay or 1 grain) ✅
5. `huntsman-b147` - Huntsman (onAction: after wood accumulation → pay 1 grain for 1 boar) ✅

**Status**: All cards tested. Huntsman inlined offer (offerHuntsmanBoar didn't exist). ForestClearer/Huntsman wood action IDs updated. StorehouseKeeper uses existing offerResourceChoice.

---

### Batch-B09: onAction – build/major/fencing (Set B) ✅ COMPLETED
**Pattern**: onAction when using Farm Expansion, Major Improvement, Grain Utilization, Fencing, or Day Laborer bonus  
**Complexity**: Tier 2–3

Cards:
1. `illusionist-b146` - Illusionist (onAction: building resource accumulation → discard 1 card for +1 resource) ✅
2. `full-peasant-b130` - Full Peasant (onAction: Grain Utilization/Fencing while other unoccupied → pay 1 food) ✅
3. `large-scale-farmer-b150` - Large-Scale Farmer (onAction: Farm Expansion/Major Improvement while other unoccupied → pay 1 food) ✅
4. `junior-artist-b152` - Junior Artist (onAction: Day Laborer → pay 1 food for Traveling Players/Lessons) ✅
5. `plumber-b128` - Plumber (onAction: Major Improvement → discounted renovation) ✅

**Status**: All cards tested. Illusionist inlined offer (offerIllusionistBonus didn't exist); uses zone moveTo for discard. JuniorArtist inlined offer (offerUseOtherSpaceChoice didn't exist); fixed TP/Lessons existence checks. Plumber inlined offer (offerDiscountedRenovation didn't exist); uses modifyRenovationCost hook with _plumberActive flag. LargeScaleFarmer fixed action IDs (farm-expansion→build-room-stable, major-improvement→major-minor-improvement). offerUseOtherSpace updated to handle cost option.

---

### Batch-B10: onBeforeAction and combined (Set B) ✅ COMPLETED
**Pattern**: onBeforeAction; onBeforeAction + onAction  
**Complexity**: Tier 2

Cards:
1. `sweep-b120` - Sweep (onBeforeAction: round card left of most recent → 2 clay) ✅
2. `stock-protector-b094` - Stock Protector (onBeforeAction: Fencing → 2 wood; onAction: Fencing → extra person) ✅

**Status**: All cards tested. Both used existing engine methods (getMostRecentlyRevealedRound, getActionSpaceRound, offerExtraPerson). No code changes needed.

---

### Batch-B11: checkTrigger (Set B) ✅ COMPLETED
**Pattern**: checkTrigger – scheduled or conditional delivery  
**Template**: Set A `Minstrel` / `PigOwner` style  
**Complexity**: Tier 2–3

Cards:
1. `manservant-b107` - Manservant (checkTrigger: once stone house → schedule 3 food/round) ✅
2. `pastor-b163` - Pastor (checkTrigger: once only player with 2 rooms → resources) ✅
3. `sheep-keeper-b154` - Sheep Keeper (checkTrigger: once 7 sheep → 3 bonus + 2 food) ✅

**Status**: All cards tested. No code changes needed. All used existing engine methods (scheduleResource, roomType, getTotalAnimals, bonusPoints).

---

### Batch-B12: onBuildRoom, onHarvest, onHarvestVegetable (Set B) ✅ COMPLETED
**Pattern**: build/harvest hooks  
**Complexity**: Tier 2

Cards:
1. `rustic-b111` - Rustic (onBuildRoom: each clay room → 2 food, 1 BP) ✅
2. `furniture-carpenter-b101` - Furniture Carpenter (onHarvest: if Joinery owned → buy 1 BP for 2 food) ✅
3. `estate-master-b132` - Estate Master (onHarvestVegetables: no unused spaces → 1 BP per vegetable) ✅

**Status**: All cards tested. Fixed FurnitureCarpenter: inlined anyPlayerOwnsJoinery (method didn't exist). Fixed EstateMaster: getUnusedSpaces→getUnusedSpaceCount, onHarvestVegetable→onHarvestVegetables.

---

### Batch-B13: onAnyAction and onPlay + phase (Set B) ✅ COMPLETED
**Pattern**: onAnyAction; onPlay plus end-of-work-phase  
**Complexity**: Tier 2–3

Cards:
1. `clay-warden-b143` - Clay Warden (onAnyAction: another uses Hollow → clay; 3p/4p variant) ✅
2. `pub-owner-b160` - Pub Owner (onWorkPhaseEnd: Forest+Clay Pit+Reed Bank occupied → 1 grain) ✅
3. `wholesaler-b137` - Wholesaler (onPlay: card state; onAction rounds 8-11 → corresponding good) ✅

**Status**: All cards tested. Fixed ClayWarden: hollowIds array (was take-clay-2), players.count()→players.all().length. Wholesaler played from hand to trigger onPlay cardState.

---

### Batch-B14: onRoundStart, onBeforeRoundStart (Set B) ✅ COMPLETED
**Pattern**: start of round or before round  
**Complexity**: Tier 2

Cards:
1. `childless-b114` - Childless (onRoundStart: 3+ rooms and 2 people → 1 food + choice) ✅
2. `scholar-b097` - Scholar (onRoundStart: stone house → play occupation for 1 food or minor) ✅
3. `nutrition-expert-b135` - Nutrition Expert (onRoundStart: exchange set for 5 food + 2 BP) ✅
4. `small-scale-farmer-b118` - Small Scale Farmer (onRoundStart: 2 rooms → 1 wood) ✅
5. `moral-crusader-b106` - Moral Crusader (onRoundStart: scheduled goods on future rounds → 1 food) ✅

**Status**: All cards tested. Fixed Scholar: used costOverride:1 for playOccupation (was double-charging). Fixed NutritionExpert: inlined offerNutritionExpertExchange, fixed getTotalAnimals() to use per-type checks. Fixed MoralCrusader: changed onBeforeRoundStart→onRoundStart (hook didn't exist), inlined hasScheduledGoodsForPlayer.

---

### Batch-B15: onWorkPhaseEnd, onPreparationEnd, onReturnHome (Set B) ✅ COMPLETED
**Pattern**: end of work phase, preparation, or return home  
**Complexity**: Tier 2–3

Cards:
1. `informant-b117` - Informant (onWorkPhaseEnd: stone > clay → 1 wood) ✅
2. `district-manager-b158` - District Manager (onAction+onWorkPhaseEnd: Forest+Grove → 5 food) ✅
3. `farmyard-worker-b140` - Farmyard Worker (multi-hook+onWorkPhaseEnd: farmyard placement → 2 food) ✅
4. `pavior-b110` - Pavior (onRoundStart: stone → 1 food; round 14 → 1 vegetable) ✅
5. `forest-scientist-b139` - Forest Scientist (onReturnHome: no wood on board → 1/2 food) ✅

**Status**: All cards tested. No code changes needed. Tests handle auto-skipped choices (Done Building/Sowing), correct sow-field action format, 3-player wood spaces (Forest+Grove only).

---

### Batch-B16: Passive cost / ability modifiers (Set B) ✅ COMPLETED
**Pattern**: no hook or passive flag – cost reduction, special build  
**Complexity**: Tier 2

Cards:
1. `carpenter-b126` - Carpenter (modifyBuildCost: 3 resource + 2 reed per room) ✅
2. `master-bricklayer-b095` - Master Bricklayer (modifyImprovementCost: stone − extra rooms) ✅
3. `brushwood-collector-b145` - Brushwood Collector (modifyBuildCost: reed → 1 wood) ✅
4. `farm-hand-b085` - Farm Hand (allowsCenterStable flag tested) ✅

**Status**: All cards tested. Fixed Carpenter: modifyRoomCost→modifyBuildCost. Fixed MasterBricklayer: modifyMajorImprovementCost→modifyImprovementCost. Fixed BrushwoodCollector: modifyReedCost→modifyBuildCost.

---

### Batch-B17: End-game scoring (Set B) ✅ COMPLETED
**Pattern**: getEndGamePoints or onScoring  
**Complexity**: Tier 1–2

Cards:
1. `organic-farmer-b098` - Organic Farmer (scoring: 1 BP per pasture with ≥1 animal and 3+ spare capacity) ✅
2. `clutterer-b100` - Clutterer (scoring: 1 BP per accumulation card played after this) ✅
3. `housemaster-b153` - Housemaster (scoring: major improvement values, smallest counts double) ✅
4. `housebook-master-b134` - Housebook Master (onRenovate: renovate to stone by round 11/12/13 → bonus) ✅
5. `trimmer-b124` - Trimmer (onBuildPasture: 2 stone per pasture built) ✅

**Status**: All cards tested. Fixed OrganicFarmer: inlined getPasturesWithSpareCapacity (used pasture.animalCount + getPastureCapacity). Fixed Clutterer: inlined getCardsWithTextPlayedAfter with onPlay cardState tracking. Fixed Housemaster: inlined getMajorImprovementValues (used card.victoryPoints). Fixed Trimmer: removed unused isSubdivision param from onBuildPasture hook.

---

### Batch-B18: Anytime, field-placement, before-harvest (Set B)
**Pattern**: anytime action; onFieldPlaced; onBeforeHarvest; or similar  
**Complexity**: Tier 2–3

Cards:
1. `lieutenant-general-b159` - Lieutenant General (for each field another places next to existing field → 1 food)
2. `weakling-b161` - Weakling (per card text)
3. `game-provider-b165` - Game Provider (onBeforeHarvest: discard 1/3/4 grain from different fields → receive goods)
4. `pasture-master-b168` - Pasture Master (each renovation → 1 additional animal of type per pasture)
5. `salter-b157` - Salter (anytime: pay 1 sheep/boar/cattle → place 1 food on round space)

**LLM Instructions:** Test anytime, field-placement, before-harvest, and renovation triggers. Salter already has tests. Create/extend tests; run; update status.

---

### Batch-B19: Scoring, onScoring, passive flags (Set B)
**Pattern**: onScoring; passive flags (no hook)  
**Complexity**: Tier 1–2

Cards:
1. `sheep-walker-b104` - Sheep Walker (passive per card text)
2. `village-peasant-b133` - Village Peasant (onScoring: vegetables = min(majors, minors, occupations))
3. `seatmate-b129` - Seatmate (passive: use round 13 space even if occupied by left/right neighbors)
4. `tutor-b099` - Tutor (getEndGamePoints: 1 BP per occupation played after this)
5. `paper-maker-b109` - Paper Maker (onBeforePlayOccupation: pay 1 wood for 1 food per occupation in front of you)

**LLM Instructions:** Test scoring and before-play-occupation. Sheep Walker already has tests. Create/extend tests; run; update status.

---

### Batch-B20: Tinsmith Master, Truffle Searcher (Set B)
**Pattern**: remaining Set B – passive or special  
**Complexity**: Tier 2

Cards:
1. `tinsmith-master-b115` - Tinsmith Master (per card text)
2. `truffle-searcher-b086` - Truffle Searcher (per card text)

**LLM Instructions:** Verify implementation and test. Create tests; run; update status.

---

## Batch Creation Guidelines

When creating new batches:

1. **Keep batches small**: 3-5 cards maximum
2. **Group by pattern**: Cards with similar mechanics
3. **Start simple**: Tier 1 cards first, then Tier 2, etc.
4. **Use templates**: Reference existing implementations
5. **Include instructions**: Clear LLM agent guidance
6. **Require status updates**: Force context refresh after each batch
7. **No one-off action manager methods**: Implement card-specific behavior on the card (inline in hooks); use action manager only for shared behavior used by multiple cards or core flow. See the rule in the "Implementation rule" section above.

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
