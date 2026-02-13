# Remaining Minor Improvements Plan

Comprehensive audit of all 107 untested minor improvement cards across decks B/C/D/E.
Organized into implementable batches of ~6 cards each.

**Legend:**
- ✅ = Done (implemented + tests passing)
- **STUB** = card calls a `game.actions.xxx()` method that doesn't exist; needs inline implementation + tests
- **TEST** = card has working inline code but no test file; needs tests (and possibly minor fixes)
- **BLOCKED** = needs unwired hook, missing method, or engine infrastructure
- **INFRA** = card needs new infrastructure (hooks, flags, or engine changes)

---

## Architecture Fix: Card State Storage (PREREQUISITE)

**Problem:** Card definitions are singleton module exports (`require()` cache).
Hook functions run with `this` bound to the singleton definition. Any `this.stored = 5`
mutates the shared singleton, leaking state between games and between tests.

**Fix:** Add `game.cardState(id)` helper that returns per-game state from
`game.state._cardState[id]`. Update all card files that store mutable state on `this`
to use `game.cardState(this.id)` instead.

**Affected minor improvement cards (8):** BeeStatue, Cubbyhole, RomanPot, WhaleOil,
PiggyBank, RodCollection, Upholstery, AshTrees

**Affected occupation cards (~25):** AgriculturalLabourer, Collector, MudWallower,
PenBuilder, WorkshopAssistant, Omnifarmer, MasterTanner, ResourceHoarder, Wolf,
FieldCultivator, SeedTrader, TreeInspector, Emissary, Bonehead, RetailDealer,
BeanCounter, Sequestrator, Mason, DenBuilder, FieldDoctor, Reseller, MasterBuilder,
DeliveryNurse, Reader, PartyOrganizer, Carter, Lazybones, ClayCarrier, Butler,
EarthenwarePotter, Dentist, Entrepreneur, Wholesaler

---

## Engine Changes Made

Hooks wired in `agricola.js`:
- `onHarvestStart` — in harvestPhase, before fieldPhase
- `onHarvestGrain` — in fieldPhase, after grain harvest (passes amount)
- `onFieldPhaseEnd` — in fieldPhase, after harvest (used by Changeover)
- `onLessonsWithCooking` — in playerTurn, when Lessons + cooking same turn
- `skipFieldAndBreeding` — per-player array, checked in fieldPhase and breedingPhase

Anytime actions infrastructure in `agricola.js`:
- `getAnytimeActions()` scans both minors AND occupations for all flag types
- `getAnytimeFoodConversionOptions()` scans occupations for `allowsAnytimeConversion`
- New action types in `executeAnytimeAction()`: `card-exchange`, `card-custom`, `card-scheduled`, `field-conversion`, `anytime-renovation`
- `getUnusedOncePerRoundActions(player)` — filters once-per-round actions not yet used
- End-of-turn reminder prompt for unused once-per-round actions
- `formatExchange()` helper for description strings
- `_usedCookingThisTurn` tracking on player during `executeAnytimeFoodConversion`

Hooks wired in `AgricolaActionManager.js`:
- `onBeforePlayOccupation` — in playOccupation, before cost payment

Methods added to `AgricolaActionManager.js`:
- `buildFreeRoom(player, card)` — build room at no cost (used by Mason, Master Builder)
- `offerSculptureCourse(player, card)` — wood→food or stone→food exchange
- `offerReedSellerConversion(player, card)` — sell reed with intercept opportunity

Helper methods added to `agricola.js`:
- `isRoundActionSpace(actionId)` — checks if action has a `stage` property
- `actionGivesReed(actionId)` — checks if action accumulates or gives reed

---

## Phase 1: Stub Fixes (Batches 10-12)

Cards calling non-existent `game.actions` methods. Each needs the stub replaced
with inline `game.actions.choose()` + direct resource manipulation, then tests written.

### Batch 10 — Simple Stubs (resource/harvest effects)

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| BumperCrop (e025) | E | ✅ | Inline + test |
| StoneClearing (c006) | C | ✅ | Inline + test |
| StableManure (d072) | D | ✅ | Inline + test |
| StrawHat (e010) | E | ✅ | Inline + test (2 tests: move or get food) |
| RavenousHunger (c042) | C | ✅ | Inline + test (2 tests: bonus worker or skip) |
| HeartOfStone (c0??) | C | **BLOCKED** | Needs `onStageReveal` hook (not wired) |

### Batch 11 — Worker/Action Stubs

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| CarriageTrip (c003) | C | ✅ | Inline + test |
| TeaTime (e003) | E | ✅ | Inline + test |
| LunchtimeBeer (e058) | E | ✅ | Inline + test (2 tests: skip or normal harvest) |
| BasketChair (c022) | C | **BLOCKED** | Worker manipulation: move first worker, place extra person |
| GuestRoom (e022) | E | **BLOCKED** | `enablesGuestWorker` flag not wired, `placeResourcesOnCard` not implemented |
| CookingHearthExtension (c062) | C | **BLOCKED** | `offerCookingHearthExtension`: multi-choice doubled cooking during harvest |

### Batch 12 — Fence/Build/Complex Stubs

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| PoleBarns (e001) | E | ✅ | Inline + test |
| HarvestFestivalPlanning (c072) | C | ✅ | Inline + test |
| NailBasket (e015) | E | ✅ | Inline + test |
| Overhaul (c001) | C | **BLOCKED** | `removeAllFences` method + fence rebuild flow |
| FieldFences (c016) | C | **BLOCKED** | Field-adjacent fence detection + cost modification |
| WorkPermit (d022) | D | **BLOCKED** | Future-round worker scheduling infrastructure |

---

## Phase 2: Tests for Inline Cards (Batches 13-22)

Cards with working inline implementations that just need test files.
Some may need minor code fixes discovered during testing.

### Batch 13 — Scoring & Passive Cards

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| HerbalGarden (e036) | E | ✅ | Test written |
| SheepRug (e021) | E | ✅ | Test written |
| BeeStatue (e040) | E | ✅ | Test written (2 tests: pop + depletion) |
| RomanPot (e056) | E | ✅ | Test written |
| WoodRake (d032) | D | **BLOCKED** | `goodsInFieldsBeforeFinalHarvest` not tracked by engine |
| BriarHedge (e016) | E | **BLOCKED** | `modifyFenceCost` doesn't pass `isEdge` param |

### Batch 14 — Food Bonus Hooks

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| NewMarket (d055) | D | ✅ | Test written. `isRoundActionSpace` added to engine |
| RaisedBed (e061) | E | ✅ | Test written. `onHarvestStart` already wired |
| Farmstead (c048) | C | **BLOCKED** | `onUseFarmyardSpace` not wired |
| HuntsmansHat (c052) | C | **BLOCKED** | `onGainBoar` not wired |
| TroutPool (d054) | D | **BLOCKED** | Fishing accumulation non-deterministic across replayed rounds |
| Lynchet (d063) | D | **BLOCKED** | `getHarvestedFieldsAdjacentToHouse` not implemented |

### Batch 15 — Harvest Phase Hooks

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| BaleOfStraw (d061) | D | ✅ | Test written (2 tests) |
| GrainSieve (d065) | D | ✅ | Test written (2 tests). `onHarvestGrain` wired |
| SocialBenefits (d076) | D | ✅ | Test written (2 tests). `onFeedingPhaseEnd` already wired |
| CheeseFondue (e057) | E | ✅ | Test written (2 tests) |
| ShepherdsWhistle (e083) | E | **BLOCKED** | `onBreedingPhaseStart` not wired |
| Slurry (c071) | C | **STUB** | Calls `game.actions.sow(player)` — needs inline fix |

### Batch 16 — Building & Renovation Hooks

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| Cubbyhole (e052) | E | ✅ | `onBuildRoom` fixed to pass count; feeding test written |
| RecycledBrick (d077) | D | **BLOCKED** | `onAnyRenovateToStone` not wired |
| Twibil (e049) | E | **BLOCKED** | `onAnyBuildRoom` not wired |
| AshTrees (e074) | E | **BLOCKED** | `getFreeFences` not called by engine |
| WoodSaw (e014) | E | **BLOCKED** | `enablesFreeBuildRooms` flag not processed |
| WoodSlideHammer (c013) | C | **BLOCKED** | `modifyRenovation` not called by engine |

### Batch 17 — Action-Triggered Hooks

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| FieldSpade (e079) | E | ✅ | Test written |
| WildGreens (e050) | E | ✅ | Test written |
| SteamMachine (c025) | C | **STUB** | Calls `game.actions.bakeBread()` stub |
| StudioBoat (c039) | C | **BLOCKED** | `traveling-players` only in 4+ player games |
| EducationBonus (d0??) | D | **BLOCKED** | `onPlayOccupation` wired but needs testing |
| FatstockStretcher (d0??) | D | **BLOCKED** | `onCook` not wired |

### Batch 18 — Capacity Modifiers & Flags

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| BeaverColony (e033) | E | ✅ | Test written (2 tests). `actionGivesReed` added |
| LawnFertilizer (d011) | D | ✅ | Signature fixed to match engine; 3 tests written |
| AnimalBedding (e012) | E | **BLOCKED** | `modifyStableCapacity` not wired |
| CattleFarm (c012) | C | **BLOCKED** | Card-based animal holding not supported |
| BunkBeds (c010) | C | **BLOCKED** | `modifyHouseCapacity` not wired |
| BrotherlyLove (d024) | D | **BLOCKED** | `allowDoubleWorkerWith4People` not processed |

### Batch 19 — Virtual Fields & Plow Cards

All **BLOCKED** — `plowField` ignores options, card-based fields not supported.

| Card | Deck | Status |
|------|------|--------|
| SwingPlow (c019) | C | **BLOCKED** |
| TurnwrestPlow (d020) | D | **BLOCKED** |
| ZigzagHarrow (d0??) | D | **BLOCKED** |
| WoodField (d075) | D | **BLOCKED** |
| NewlyPlowedField (c017) | C | **BLOCKED** |
| CowPatty (e071) | E | **BLOCKED** (`isFieldAdjacentToPasture` missing) |

### Batch 20 — Card State & Storage

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| WhaleOil (e051) | E | ✅ | Test written. `onBeforePlayOccupation` wired. **Needs card state fix** |
| PettingZoo (e0??) | E | **BLOCKED** | Card-based animal holding not supported |
| SkimmerPlow (e017) | E | **BLOCKED** | `modifySowAmount`/`modifyPlowCount` not wired |
| AlchemistsLab (e081) | E | **BLOCKED** | Complex action space for all players |
| MaterialHub (c081) | C | **BLOCKED** | `onAnyAction` not wired |
| GypsysCrock (c053) | C | **BLOCKED** | `onCook` not wired |

### Batch 21 — Occupation & Improvement Interactions

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| Blueprint (c027) | C | ✅ | 6 tests written (flag + cost modifier) |
| Recruitment (d021) | D | **BLOCKED** | `modifyMinorImprovementAction` not processed |
| JobContract (c023) | C | **BLOCKED** | `allowsCombinedAction` not processed |
| CarpentersYard (d0??) | D | **BLOCKED** | Flags not processed |
| Bookcase (c0??) | C | **BLOCKED** | `onPlayOccupation` wired but needs testing |
| Bookshelf (d049) | D | ✅ | Test written (3 food before occupation) |

### Batch 22 — Miscellaneous

| Card | Deck | Status | Notes |
|------|------|--------|-------|
| FarmBuilding (c043) | C | **BLOCKED** | `onBuildMajor` not wired |
| BedInTheGrainField (c0??) | C | **BLOCKED** | `bedInGrainFieldNextHarvest` flag not processed |
| TeaHouse (d053) | D | **BLOCKED** | `allowsSkipSecondPerson` not processed |
| RoyalWood (d074) | D | **BLOCKED** | `onBuildImprovement`/`onFarmExpansion` not wired |
| HuntingTrophy (d082) | D | **BLOCKED** | `modifyHouseRedevelopmentCost` not wired |
| Archway (d051) | D | **BLOCKED** | `archwayExtraAction` flag not processed |

---

## Phase 3: MinorB Infrastructure (Batches 23-24)

MinorB cards that need unique infrastructure beyond simple inline fixes.

### Batch 23 — MinorB with Existing Methods / Simple Flags

| Card | Deck | Blocker | Notes |
|------|------|---------|-------|
| UpscaleLifestyle (b001) | B | None — anytime renovation infra exists | Just needs tests |
| Caravan (b010) | B | `providesRoom` flag | Works but needs family growth E2E test |
| PotteryYard (b031) | B | `hasAdjacentUnusedSpaces` | Needs new player method |
| SpecialFood (b034) | B | `onTakeAnimals` + `allAccommodated` | Hook needs parameter added |
| AgrarianFences (b026) | B | `modifyGrainUtilization` flag | Flag not processed in game engine |
| WoodPalisades (b030) | B | `allowWoodPalisades` flag | Wood as fence material not supported |

### Batch 24 — MinorB Stubs Needing New Methods

| Card | Deck | Stub Method | Blocker |
|------|------|-------------|---------|
| CarpentersBench (b015) | B | `offerCarpentersBench` | Build pasture with taken wood, 1 free fence |
| Hauberg (b041) | B | `offerHauberg` | Alternating wood/boar schedule system |
| HayloftBarn (b021) | B | `familyGrowthWithoutRoom` | `onGainGrain` hook wired but family growth without room needed |
| MiniPasture (b002) | B | `buildFreeSingleSpacePasture` | Single-space pasture building system |
| Toolbox (b027) | B | `offerToolboxMajor` | Offer Joinery/Pottery/Basketmaker after build actions |

---

## Phase 4: Anytime Action Cards (DONE — Batches 25-27)

Anytime actions engine infrastructure implemented in `agricola.js`:
- `getAnytimeActions()` extended to scan occupations (not just minors)
- New action types: `card-exchange`, `card-custom`, `card-scheduled`, `field-conversion`, `anytime-renovation`
- Once-per-round tracking via `game.cardState(cardId).lastUsedRound`
- End-of-turn reminder for unused once-per-round actions
- `formatExchange()` helper for description strings
- `_usedCookingThisTurn` tracking + `onLessonsWithCooking` hook

New methods in `AgricolaActionManager.js`:
- `buildFreeRoom(player, card)` — build room at no cost
- `offerSculptureCourse(player, card)` — wood→food or stone→food exchange
- `offerReedSellerConversion(player, card)` — sell reed, other players can intercept

### Batch 25 — Anytime Exchanges

| Card | Deck | Status | Effect |
|------|------|--------|--------|
| HardPorcelain (b080) | B | ✅ | 2/3/4 clay → 1/2/3 stone |
| Kettle (b032) | B | ✅ | 1/3/5 grain → 3/4/5 food + 0/1/2 VP |
| LargePottery (d060) | D | ✅ | Already worked (anytimeConversions) |
| Trowel (d013) | D | ✅ | Anytime renovate to stone (special cost) |
| StoneHouseReconstruction (e013) | E | ✅ | Anytime renovate clay→stone (normal cost, no person) |
| EarthOven (d059) | D | ✅ | Already worked (anytimeConversions) |
| StableYard (c050) | C | ✅ | 1 sheep + 1 boar → 1 cattle |

### Batch 26 — Anytime Purchases & Scheduled

| Card | Deck | Status | Effect |
|------|------|--------|--------|
| PottersMarket (b069) | B | ✅ | 3 clay + 2 food → schedule 1 vegetable on next 2 rounds |
| MuddyPuddles (b083) | B | ✅ | 1 clay → take top from stack (state migrated to cardState) |
| Mandoline (c046) | C | ✅ | Once/round: 1 vegetable → 1 VP + schedule 1 food on next 2 rounds |
| CornSchnappsDistillery (c064) | C | ✅ | Once/round: 1 grain → schedule 1 food on next 4 rounds |
| PelletPress (d046) | D | ✅ | Once/round: 1 reed → schedule 1 food on next 4 rounds |
| Grocer (a102) | A (occ) | ✅ | Buy top good for 1 food (state migrated to cardState) |
| SourDough (e062) | E | **DEFERRED** | Requires fundamental worker placement flow changes |

### Batch 27 — Anytime Field/Special/Occupations

| Card | Deck | Status | Effect |
|------|------|--------|--------|
| SculptureCourse (b053) | B | ✅ | Non-harvest rounds: 1 wood → 2 food OR 1 stone → 4 food |
| CookeryLesson (b029) | B | ✅ | Bonus point when cooking + Lessons on same turn |
| LandConsolidation (c069) | C | ✅ | 3 grain in field → 1 vegetable in that field |
| RollOverPlow (c018) | C | ✅ | With 3+ planted fields: discard from 1 field → plow 1 field |
| Changeover (d071) | D | ✅ | After harvest (onFieldPhaseEnd hook): field with 1 good → sow |
| BasketmakersWife (c139) | C (occ) | ✅ | 1 reed → 2 food (engine now scans occupations) |
| ClayFirer (d162) | D (occ) | ✅ | 2 clay → 1 stone, 3 clay → 2 stone |
| SheepWalker (b104) | B (occ) | ✅ | 1 sheep → 1 boar/vegetable/stone |
| ClayCarrier (d122) | D (occ) | ✅ | Once/round: 2 food → 2 clay |
| SeedTrader (d114) | D (occ) | ✅ | Buy grain (2 food) or vegetable (3 food) from card stock |
| WhiskyDistiller (d106) | D (occ) | ✅ | 1 grain → schedule 4 food in 2 rounds |
| Emissary (d124) | D (occ) | ✅ | Place unique good → get 1 stone |
| Salter (b157) | B (occ) | ✅ | Pay animal → schedule food (3/5/7 rounds) |
| Mason (c087) | C (occ) | ✅ | Free stone room (once, requires 4+ stone rooms) |
| MasterBuilder (d087) | D (occ) | ✅ | Free room (once per game, requires 5+ rooms) |
| ReedSeller (d159) | D (occ) | ✅ | 1 reed → 3 food (or 2 food if another player buys) |
| PenBuilder (e086) | E (occ) | ✅ | Place wood on card → holds 2× animals |
| StableCleaner (c094) | C (occ) | ✅ | Build stables at 1 wood + 1 food each |
| Sower (c115) | C (occ) | **DEFERRED** | Needs `onBuildMajor` hook + reed-tracking system |

---

## Progress Summary

| Phase | Done | Blocked/Deferred | Total |
|-------|------|------------------|-------|
| 1: Stub Fixes | 11 | 7 | 18 |
| 2: Test-Only | 21 | 37 | 60 |
| 3: MinorB Infra | 0 | 11 | 11 |
| 4: Anytime | 33 | 2 deferred | 35 |
| **Total** | **65** | **57** | **124** |

### Hook Wiring Status

✅ = Wired and working. ❌ = Not wired.

- ✅ `onAction` — in executeAction
- ✅ `afterPlayerAction` — in playerTurn
- ✅ `onWorkPhaseStart` — in workPhase
- ✅ `onWorkPhaseEnd` — in workPhase
- ✅ `onHarvestStart` — in harvestPhase
- ✅ `onHarvest` — in harvestPhase
- ✅ `onHarvestGrain` — in fieldPhase
- ✅ `onFeedingPhase` — in feedingPhase
- ✅ `onFeedingPhaseEnd` — in feedingPhase
- ✅ `onBreedingPhaseEnd` — in breedingPhase
- ✅ `onFieldPhaseEnd` — in fieldPhase (used by Changeover)
- ✅ `onBake` — in bake action
- ✅ `onBakeBreadAction` — in bake bread action space
- ✅ `onAfterSow` — in sow action
- ✅ `onBuildRoom` — in buildRoom action
- ✅ `onBuildFences` — in buildFences action
- ✅ `onPlayOccupation` — in playOccupation (after play)
- ✅ `onBeforePlayOccupation` — in playOccupation (before cost)
- ✅ `onBeforeAction` — in playerTurn (before action execution)
- ✅ `onUseSpace` / `onUseMultipleSpaces` — in playerTurn
- ✅ `onLessonsWithCooking` — in playerTurn (Cookery Lesson)
- ✅ `onRoundEnd` — in mainLoop (Sculpture Course)
- ✅ `isRoundActionSpace()` — helper method
- ✅ `actionGivesReed()` — helper method
- ✅ `getUnusedOncePerRoundActions()` — helper for end-of-turn reminder
- ❌ `onBreedingPhaseStart` — needed by ShepherdsWhistle
- ❌ `onStageReveal` — needed by HeartOfStone
- ❌ `onUseFarmyardSpace` — needed by Farmstead
- ❌ `onGainBoar` — needed by HuntsmansHat
- ❌ `onAnyRenovateToStone` — needed by RecycledBrick
- ❌ `onAnyBuildRoom` — needed by Twibil
- ❌ `onBuildMajor` — needed by FarmBuilding
- ❌ `onCook` — needed by FatstockStretcher, GypsysCrock
- ❌ `modifyHouseCapacity` — needed by BunkBeds
- ❌ `modifyRenovationCost` — needed by WoodSlideHammer
- ❌ `modifyStableCapacity` — needed by AnimalBedding
- ❌ `modifySowAmount` — needed by CowPatty, SkimmerPlow
- ❌ `modifyPlowCount` — needed by SkimmerPlow
- ❌ `modifyFenceCost` (isEdge param) — wired but doesn't pass isEdge
- ❌ `getFreeFences` — needed by AshTrees
- ❌ `isFieldAdjacentToPasture` — needed by CowPatty
- ❌ `getHarvestedFieldsAdjacentToHouse` — needed by Lynchet
- ❌ `goodsInFieldsBeforeFinalHarvest` — needed by WoodRake

### plowField Options Not Supported

`plowField(player)` exists but ignores options. These cards call it with
unsupported options that need to be either added to the method or inlined:

- `{ allowNonAdjacent: true }` — NewlyPlowedField
- `{ zigzagPattern: true }` — ZigzagHarrow
- `{ immediate: true }` — SwingPlow, TurnwrestPlow (card-based field tiles)
