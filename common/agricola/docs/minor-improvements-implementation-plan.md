# Minor Improvements Implementation Plan (B/C/D/E)

Cards grouped by shared infrastructure needs. Within each batch, cards are
ordered from simplest to most complex.

Notation: `*` = already implemented but untested, needs tests + possible fixes.

---

## Batch 1 — On-Play Immediate (No Ongoing Effect)

Cards that do something when played and have no hooks or ongoing effects.
Simplest to implement — just `onPlay()` logic.

| Card | Deck | Effect |
|------|------|--------|
| Furrows (d003) | D | Immediately sow in exactly 1 field |
| Cross-Cut Wood (d004) | D | Get wood equal to stone in supply |
| Field Clay (d005) | D | Get 1 clay per planted field |
| Petrified Wood (d006) | D | Exchange up to 3 wood for 1 stone each |
| Trident (d007) | D | Get 3/4/5/6 food based on round 3/6/9/12 |
| Game Trade (d009) | D | Pay 2 sheep → get 1 boar + 1 cattle |
| Dwelling Plan (d002) | D | Take a free Renovation action |
| Pumpernickel (e007) | E | Get 4 food (pay 1 grain as cost) |
| Farmers Market (e008) | E | Get 1 vegetable (pay 2 food as cost) |
| Recount (e006) | E | Get 1 of each building resource you have 4+ of |
| Sleight of Hand (e078) | E | Exchange up to 4 building resources for others |
| Thunderbolt (e004) | E | Remove all grain from a field → 2 wood each |
| Night Loot (e005) | E | Take 2 different building resources from accumulation spaces |
| Bumper Crop (e025) | E | Immediately play field phase on your farmyard |
| Lumber Pile (e076) | E | Return up to 3 stables → 3 wood each |
| Bartering Hut (e009) | E | Up to 2x: spend 2/3/4 building resources for sheep/boar/cattle |
| Almsbag (e065) | E | Get 1 grain per 2 completed rounds |
| Writing Boards (c004) | C | Get 1 wood per played occupation |
| Remodeling (c005) | C | Get 1 clay per clay room + major improvement |
| Flail (c026) | C | Get 2 food on play (also has ongoing bake trigger) |
| Canvas Sack (c040) | C | Pay grain→vegetable or reed→4 wood |
| Christianity (c038) | C | All other players get 1 food each |
| Early Cattle (c083) | C | Get 2 cattle (card is -3 VP) |
| Ox Skull (e037) | E | Get 1 food on play (also scoring if no cattle) |
| Working Gloves (e060) | E | Get 1 food on play (also occupation cost modifier) |
| Pole Barns (e001) | E | Build up to 3 free stables |
| Renovation Materials (e002) | E | Free renovation to clay |
| Stable (c002) | C | Build 1 free stable |
| Newly-Plowed Field (c017) | C | Plow 1 field (non-adjacent allowed) |
| Foreign Aid (d050) | D | Get 6 food; can't use round 12-14 action spaces |
| Stone Clearing (c006) | C | Place 1 stone on each empty field (harvest as crop) |
| Automatic Water Trough (c009) | C | Buy 1 sheep/boar/cattle for 0/1/2 food |

**Status**: 21/31 tested. Implemented `sowSingleField`, `offerRenovation`, `petrifiedWoodExchange` in ActionManager. Fixed bugs: `addAnimal`→`addAnimals` (GameTrade, EarlyCattle, FeedPellets, Pigswill, ShepherdsWhistle), `getPlantedFields`→`getSownFields` (FieldClay), `getAnimalCount`→`getTotalAnimals` (OxSkull).

**Deferred** (need missing infrastructure):
- Sleight of Hand (e078) — needs `sleightOfHand` method
- Thunderbolt (e004) — needs `thunderboltExchange` method
- Night Loot (e005) — needs `nightLoot` method
- Bumper Crop (e025) — needs `harvestFields` method
- Lumber Pile (e076) — needs `lumberPileExchange` method
- Bartering Hut (e009) — needs `barteringHut` method
- Pole Barns (e001) — needs `buildFreeStables` (plural) method
- Renovation Materials (e002) — needs `freeRenovation` method
- Newly-Plowed Field (c017) — needs `plowField` with `allowNonAdjacent` option
- Stone Clearing (c006) — needs `stoneClearingEffect` method
- Automatic Water Trough (c009) — needs `automaticWaterTroughPurchase` method

---

## Batch 2 — Scheduled Resources

Cards that place resources on future round spaces. Well-established pattern
using `game.scheduleResource()`.

| Card | Deck | Effect |
|------|------|--------|
| Clay Supply (c077) | C | 1 clay on each of next 3 rounds |
| Chicken Coop (c044) | C | 1 food on each of next 8 rounds |
| Stew (c045) | C | On Day Laborer: 1 food on each of next 4 rounds |
| Garden Claw (c047) | C | 1 food on remaining rounds (up to 3x planted fields) |
| Private Forest (c074) | C | 1 wood on remaining even-numbered rounds |
| Reed-Hatted Toad (c078) | C | 1 reed on rounds current+5,+7,+9,+11,+13 |
| Stone Cart (c079) | C | 1 stone on remaining even-numbered rounds |
| Farm Building (c043) | C | On build major: 1 food on each of next 3 rounds |
| Granary (c065) | C | 1 grain on rounds 8, 10, 12 (offset from current round) |
| Cesspit (d040) | D | Alternating clay/boar on remaining rounds |
| Horse-Drawn Boat (d041) | D | Alternating food/sheep on remaining rounds |
| Hutch (d043) | D | 0, 1, 2, 3 food on next 4 rounds |
| Forest Well (d044) | D | 1 food on remaining rounds (up to wood in supply) |
| Sheep Well (d045) | D | 1 food on next rounds (up to sheep count) |
| Churchyard (d047) | D | 2 food on each remaining round |
| Wholesale Market (d057) | D | 1 food on each remaining round |
| Reap Hook (d067) | D | 1 grain on next 3 of [4,7,9,11,13,14] |
| Reed Pond (d078) | D | 1 reed on each of next 3 rounds |
| Small Greenhouse (d069) | D | 1 vegetable on rounds current+4 and current+7 (buy for 1 food) |
| Muddy Waters (e041) | E | Alternating food/clay on remaining even-numbered rounds |
| Water Gully (e042) | E | Cattle, grain, cattle on next 3 rounds |
| Barn Cats (e043) | E | 1 food on next 2/3/4/5 rounds based on stable count |
| Fodder Beets (e044) | E | 1 food on remaining odd-numbered rounds |
| Fruit Ladder (e045) | E | 1 food on remaining even-numbered rounds |
| Waterlily Pond (e046) | E | 1 food on next 2 rounds |
| Bookmark (e028) | E | Free occupation on round current+3 |

**Status**: 25/26 tested. Fixed bugs: `getPlantedFields`→`getSownFields` (GardenClaw), refactored MuddyWaters to use `scheduleResource()`.

**Deferred**:
- Farm Building (c043) — uses `onBuildMajor` hook which is not wired in AgricolaActionManager

**Notes**: `cardsInPlay` and `majorImprovement` (specific card) prereqs are not yet enforced (in deferred TODO in AgricolaPlayer.js). Tests for Churchyard, MuddyWaters, and WaterGully still pass because the prereq check falls through.

---

## Batch 3 — Scoring / VP Only

Cards with no gameplay effect — only bonus/negative VP during scoring.

| Card | Deck | Effect |
|------|------|--------|
| Half-Timbered House (c030) | C | 1 VP per stone room |
| Writing Chamber (c031) | C | VP equal to negative points (max 7) |
| Abort Oriel (c032) | C | 3 VP (can only play if no player has 5+ cards) |
| Greening Plan (c033) | C | 1/2/3/5 VP for 2/4/5/6 unplanted fields |
| Lantern House (c035) | C | 7 VP, -1 VP per card left in hand |
| Dwelling Mound (c037) | C | 3 VP, must pay 1 food per new field |
| Muck Rake (d029) | D | 1 VP per unfenced stable with exactly 1 animal of unique type |
| Artisan District (d030) | D | 2/5/8 VP for 3/4/5 bottom-row major improvements |
| Storeroom (d031) | D | 0.5 VP per grain+vegetable pair (rounded up) |
| Wood Rake (d032) | D | 2 VP if 7+ goods in fields before final harvest |
| Summer House (d033) | D | 2 VP per unused space adjacent to house (if stone house) |
| Luxurious Hostel (d034) | D | 4 VP if more stone rooms than people |
| Fodder Chamber (d035) | D | 1 VP per 3rd/4th/5th/7th animal (varies by player count) |
| Breed Registry (d036) | D | 3 VP if gained max 2 sheep from non-breeding + never cooked |
| Sculpture (d037) | D | 2 VP (can only play if rounds left > unused spaces) |
| Nave (e032) | E | 1 VP per farmyard column with at least 1 room |
| Land Register (e034) | E | 2 VP if no unused spaces |
| Misanthropy (e035) | E | 2/3/5 VP for exactly 4/3/2 people |
| Heirloom (e029) | E | 2 VP (requires person on Day Laborer) |
| Child's Toy (e030) | E | 2 VP, newborns need 2 food instead of 1 |

**Status**: 15/20 tested. Fixed bugs: `getEmptyFieldCount()`→`getEmptyFields().length` (GreeningPlan), `getHandSize()`→`hand.length` (LanternHouse), `getUnusedSpaces()`→`getUnusedSpaceCount()` (LandRegister). Implemented `getGrainInFields()`, `getVegetablesInFields()`, `getColumnsWithRooms()` on AgricolaPlayer.

**Deferred** (need missing infrastructure):
- Writing Chamber (c031) — needs `calculateNegativePoints()` (complex scoring logic)
- Muck Rake (d029) — needs `getUnfencedStablesWithAnimals()` method
- Summer House (d033) — needs `getUnusedSpacesAdjacentToHouse()` method
- Wood Rake (d032) — needs `goodsInFieldsBeforeFinalHarvest` tracking field
- Breed Registry (d036) — tested onPlay/getEndGamePoints directly, but sheep source tracking hooks not wired

---

## Batch 4 — Round-Start / Returning-Home Triggered

Cards that trigger at the start of rounds or returning home phase.

| Card | Deck | Effect |
|------|------|--------|
| Mineral Feeder (c067) | C | Non-harvest round start: 1 grain if sheep in pasture |
| Civic Facade (d048) | D | Round start: 1 food if more occupations than improvements in hand |
| Rolling Pin (d052) | D | Returning home: 1 food if more clay than wood |
| Roman Pot (e056) | E | Work phase start: 1 food if last in turn order (from stored food) |
| Stork's Nest (d010) | D | Returning home: family growth if more rooms than people (pay 1 food) |
| Steam Plow (d018) | D | After returning home: pay 2 wood + 1 food to use Farmland |
| Baking Course (d064) | D | Non-harvest round end: take Bake Bread action |
| Tea House (d053) | D | Once per round: skip placing 2nd person → 1 food |

**Status**: 4/8 tested. Fixed bugs: `getSheepInPastures()`→`getTotalAnimals('sheep')` (MineralFeeder). Added `getImprovementsInHand()` to AgricolaPlayer. All hooks (onRoundStart, onReturnHome, onRoundEnd) are wired.

**Deferred** (need missing infrastructure):
- Roman Pot (e056) — needs `isLastInTurnOrder()` method
- Stork's Nest (d010) — needs `canAddFamilyMember()` + `offerStorksNest()` methods
- Steam Plow (d018) — needs `offerSteamPlow()` method
- Tea House (d053) — needs `allowsSkipSecondPerson` flag processing in game engine

---

## Batch 5 — Action-Space Triggered

Cards that trigger when specific action spaces are used.

| Card | Deck | Effect |
|------|------|--------|
| Woodcraft (c058) | C | Wood accumulation: 1 food if ≤5 wood after |
| Wood Cart (c076) | C | Wood accumulation: +2 additional wood |
| Hardware Store (c082) | C | Day Laborer: pay 2 food → 1 each of wood/clay/reed/stone |
| Stew (c045) | C | Day Laborer: schedule 1 food on next 4 rounds |
| Flail (c026) | C | Farmland/Cultivation: also Bake Bread |
| Mole Plow (c020) | C | Farmland/Cultivation: plow 1 additional field |
| Rocky Terrain (c080) | C | On plow: buy 1 stone for 1 food |
| Trellis (c015) | C | Before Pig Market: take Build Fences action |
| Studio Boat (c039) | C | Traveling Players: +1 VP (or +1 food accumulation in 1-3p) |
| Teacher's Desk (c028) | C | Major Improvement/House Redevelopment: play 1 occupation for 1 food |
| Ravenous Hunger (c042) | C | Vegetable Seeds: place another person on accumulation space |
| Wooden Whey Bucket (d016) | D | Before Sheep/Cattle Market: build 1 stable (1 wood / free) |
| Drill Harrow (d017) | D | Before Sow: pay 3 food to plow 1 field |
| Pulverizer Plow (d019) | D | After clay accumulation: pay 1 clay to plow 1 field |
| Small Basket (d068) | D | Reed Bank: pay 1 reed for 1 vegetable |
| Supply Boat (d073) | D | After Fishing: buy 1 grain for 1 food, or 1 vegetable for 3 food |
| Truffle Slicer (d039) | D | Wood accumulation + 1 boar: pay 1 food for 1 VP |
| Writing Desk (d028) | D | Lessons: play 1 additional occupation for 2 food |
| New Market (d055) | D | Round 8-11 action space cards: +1 food |
| Gritter (d058) | D | After sow vegetables: 1 food per vegetable field |
| Nail Basket (e015) | E | After wood accumulation: place 1 stone on space → Build Fences |
| Stone Axe (e075) | E | Wood accumulation: return 1 stone → +3 wood |
| Mattock (e077) | E | Get reed/stone from action space: +1 clay |
| Syrup Tap (e047) | E | Get wood from action space: schedule 1 food next round |
| Barn Shed (e066) | E | When ANY player uses Forest: get 1 grain |
| Comb and Cutter (e059) | E | Day Laborer: +1 food per sheep on Sheep Market (max 4) |
| Profiteering (e082) | E | Day Laborer: exchange 1 building resource for another |
| Grain Bag (e067) | E | Grain Seeds: +1 grain per baking improvement |
| Ox Goad (e019) | E | After Cattle Market: pay 2 food to plow 1 field |
| Stone Weir (e055) | E | Fishing: get additional 4/3/2/1 food if 0/1/2/3 food on space |
| Rod Collection (e038) | E | Fishing: place up to 2 wood on card (VP at scoring) |

**Status**: 11/31 tested (Stew, Flail previously; Woodcraft, Wood Cart, Mole Plow, Gritter, Mattock, Syrup Tap, Barn Shed, Comb and Cutter, Stone Weir new). Fixed bugs: `'sheep-market'`→`'take-sheep'` (CombAndCutter), wrong param order + `'forest'`→`'take-wood'` (BarnShed). Added `resources` parameter to `onAction` hook for Mattock/SyrupTap.

**Deferred** (need missing infrastructure):
- Hardware Store (c082) — needs `offerHardwareStore`
- Rocky Terrain (c080) — needs `onPlowField` hook + `offerRockyTerrain`
- Trellis (c015) — needs `onBeforeAction` hook wired
- Studio Boat (c039) — `traveling-players` only in 4+ player games
- Teacher's Desk (c028) — needs `offerOccupationForFood`
- Ravenous Hunger (c042) — needs `offerRavenousHunger`
- Wooden Whey Bucket (d016) — needs `onBeforeAction` hook wired
- Drill Harrow (d017) — needs `onBeforeSow` hook + `offerDrillHarrow`
- Pulverizer Plow (d019) — needs `offerPulverizerPlow`
- Small Basket (d068) — needs `offerSmallBasket`
- Supply Boat (d073) — needs `offerSupplyBoat`
- Truffle Slicer (d039) — needs `offerTruffleSlicer`
- Writing Desk (d028) — needs `offerOccupationForFood`
- New Market (d055) — needs `isRoundActionSpace` method
- Nail Basket (e015) — needs `offerNailBasket`
- Stone Axe (e075) — needs `offerStoneAxe`
- Profiteering (e082) — needs `offerResourceExchange`
- Grain Bag (e067) — needs `getBakingImprovementCount`
- Ox Goad (e019) — needs `offerPlowForFood`
- Rod Collection (e038) — needs `offerRodCollection`

---

## Batch 6 — Harvest Phase Cards

Cards that trigger during feeding, field phase, or breeding phase of harvest.

| Card | Deck | Effect |
|------|------|--------|
| Milking Place (d012) | D | Feeding: +1 food (but can't hold animals in house) |
| Beer Stall (c049) | C | Feeding: per empty unfenced stable, 1 grain → 5 food |
| Studio (c055) | C | Feeding: 1 wood/clay/stone → 2/2/3 food |
| Schnapps Distillery (c059) | C | Feeding: 1 vegetable → 5 food (+ VP for 5th/6th vegetable) |
| Craft Brewery (c063) | C | Feeding: 1 grain supply + 1 grain from field → 2 VP + 4 food |
| Beer Tap (d062) | D | Feeding: 2/3/4 grain → 3/6/9 food |
| Feed Pellets (d084) | D | Feeding: 1 vegetable → 1 animal of type you already have |
| Town Hall (e048) | E | Feeding: 1/2 food if clay/stone house |
| Lunchtime Beer (e058) | E | Harvest start: skip field+breeding → 1 food |
| Raised Bed (e061) | E | Harvest start: 4 food |
| Bale of Straw (d061) | D | Harvest start: 2 food if 3+ grain fields |
| Lynchet (d063) | D | Field phase: 1 food per harvested field adjacent to house |
| Grain Sieve (d065) | D | Field phase: +1 grain if harvesting 2+ grain |
| Milking Stool (d038) | D | Field phase: 1/2/3 food for 1/3/5 cattle (+ VP per 2 cattle) |
| Straw Manure (d070) | D | Before field phase: pay 1 grain → +1 vegetable on 2 veg fields |
| Stable Manure (d072) | D | Field phase: harvest 1 extra good per unfenced stable |
| Elephantgrass Plant (c034) | C | After harvest: 1 reed → 1 VP |
| Eternal Rye Cultivation (c066) | C | After harvest: 1 food if 2 grain, +1 grain if 3+ grain |
| Farm Store (c041) | C | After feeding: 1 food → 2 different building resources or 1 vegetable |
| Social Benefits (d076) | D | After feeding: if no food left, get 1 wood + 1 clay |
| Slurry (c071) | C | Breeding: if newborns of 2+ types, get Sow action |
| Perennial Rye (c084) | C | Non-harvest rounds: pay 1 grain to breed 1 type |
| Cooking Hearth Extension (c062) | C | Harvest: double food from 1 animal/vegetable per cooking improvement |
| Harvest Festival Planning (c072) | C | On play: field phase + Major/Minor Improvement |
| Seaweed Fertilizer (c073) | C | After Sow: +1 grain (or vegetable from round 11) |
| Scythe (e073) | E | Field phase: harvest ALL crops from 1 chosen field |
| Shepherd's Whistle (e083) | E | Breeding start: 1 sheep if unfenced stable without animal |
| Paintbrush (e039) | E | Each harvest: 1 clay → 2 food or 1 VP |

**Infrastructure needed**: `onFeedingPhase`, `onFieldPhase`, `onBreedingPhase`, `onHarvestStart`, `onHarvestEnd` hooks. Most should be wired already.

**Status**: 4/27 tested (MilkingPlace, TownHall, MilkingStool, EternalRyeCultivation). Only cards using already-wired hooks with no missing methods were testable.

**Deferred** (need missing hooks):
- Lunchtime Beer (e058) — `onHarvestStart` not wired
- Raised Bed (e061) — `onHarvestStart` not wired
- Bale of Straw (d061) — `onHarvestStart` not wired
- Grain Sieve (d065) — `onHarvestGrain` not wired
- Social Benefits (d076) — `onFeedingPhaseEnd` not wired
- Shepherd's Whistle (e083) — `onBreedingPhaseStart` not wired
- Scythe (e073) — `onFieldPhase` not wired
- Slurry (c071) — `onBreedingPhaseEnd` doesn't pass `newbornTypes` parameter
- Straw Manure (d070) — `onBeforeFieldPhase` not wired

**Deferred** (need missing ActionManager methods):
- Beer Tap (d062) — needs `offerBeerTap`
- Studio (c055) — needs `offerStudio`
- Schnapps Distillery (c059) — needs `offerSchnappsDistillery`
- Craft Brewery (c063) — needs `offerCraftBrewery` + `player.hasGrainField()`
- Feed Pellets (d084) — needs `offerFeedPellets` + `player.hasAnyAnimals()`
- Stable Manure (d072) — needs `harvestExtraGoods`
- Perennial Rye (c084) — needs `offerPerennialRye`
- Cooking Hearth Extension (c062) — needs `offerCookingHearthExtension`
- Harvest Festival Planning (c072) — needs `harvestFieldPhase` + `majorOrMinorImprovement`
- Seaweed Fertilizer (c073) — needs `offerSeaweedFertilizer`
- Farm Store (c041) — needs `offerFarmStore` + `onFeedingPhaseEnd` not wired
- Beer Stall (c049) — needs `offerBeerStall` + `player.getEmptyUnfencedStableCount()`
- Lynchet (d063) — needs `getHarvestedFieldsAdjacentToHouse`
- Paintbrush (e039) — needs `offerPaintbrush`
- Elephantgrass Plant (c034) — needs `offerElephantgrassPlant`

---

## Batch 7 — Building, Renovation & Fencing

Cards that modify or trigger on building/renovation/fencing actions.

| Card | Deck | Effect |
|------|------|--------|
| Clay Supports (d015) | D | Alternative room cost: 2 clay + 1 wood + 1 reed |
| Straw-thatched Roof (c014) | C | No reed needed for renovation or building rooms |
| Roof Ladder (d081) | D | Renovation: -1 reed cost, +1 stone at end |
| Wood Slide Hammer (c013) | C | First renovation with 5+ wood rooms: skip clay, -2 stone |
| Hunting Trophy (d082) | D | Improvements on House Redevelopment: -1 building resource; Fences on Farm Redevelopment: -3 wood |
| Brick Hammer (d080) | D | After building improvement costing 2+ clay: +1 stone |
| Recycled Brick (d077) | D | When any player renovates to stone: 1 clay per room |
| Feed Fence (c056) | C | On build stable: 1 food (3 for last); 1 stable for 1 clay instead of wood |
| Pigswill (d083) | D | Fencing action: also get 1 wild boar |
| Retraining (d027) | D | After renovation: exchange Joinery↔Pottery↔Basketmaker's |
| Hammer Crusher (d014) | D | Before renovate to stone: 2 clay + 1 reed + Build Rooms action |
| Field Fences (c016) | C | On play: Build Fences, free fences next to fields |
| Overhaul (c001) | C | On play: raze all fences, add 3 from supply, rebuild |
| Ash Trees (e074) | E | On play: store 5 fences on card (free when building) |
| Briar Hedge (e016) | E | Edge-of-board fences are free |
| Cubbyhole (e052) | E | Per room added: 1 food on card. Feeding start: get all food from card |
| Twibil (e049) | E | When any player builds wood room: get 1 food |
| Wood Saw (e014) | E | When all others have more people: Build Rooms without placing person |
| Recruitment (d021) | D | On Minor Improvement action: can do Family Growth instead |
| Ambition (e024) | E | On Minor Improvement action: can build major instead |

**Infrastructure needed**: `onBuildRoom`, `onRenovate`, `onBuildFences`, `onBuildStable` hooks. `modifyRoomCost`, `modifyRenovationCost`, `modifyFenceCost` modifiers. Some need `onBeforeRenovate`.

**Status**: 7/20 tested (RoofLadder, BrickHammer, Pigswill, ClaySupports, Ambition, FeedFence, StrawThatchedRoof). Fixed `onBuildImprovement` hook to pass `cost` parameter (BrickHammer needs it). Note: `modifyRenovationCost` hook is NOT wired — RoofLadder cost reduction doesn't work, only `onRenovate` stone bonus tested.

**Deferred** (need missing hooks):
- RecycledBrick (d077) — `onAnyRenovateToStone` not wired
- Twibil (e049) — `onAnyBuildRoom` not wired
- HammerCrusher (d014) — `onBeforeRenovateToStone` not wired + `offerBuildRooms` missing

**Deferred** (need missing methods/flags):
- HuntingTrophy (d082) — `modifyHouseRedevelopmentCost` / `modifyFarmRedevelopmentFenceCost` never called
- Retraining (d027) — `offerRetraining` missing
- FieldFences (c016) — `fieldFencesAction` missing
- Overhaul (c001) — `overhaulFences` missing
- WoodSaw (e014) — `enablesFreeBuildRooms` flag not implemented
- Recruitment (d021) — `modifyMinorImprovementAction` flag not implemented
- WoodSlideHammer (c013) — `modifyRenovation` method not wired
- AshTrees (e074) — `getFreeFences` / `fencesRemaining` integration untested
- BriarHedge (e016) — complex prereqs (3 animal types) + edge fence cost verification difficult
- Cubbyhole (e052) — needs room building + harvest, complex multi-step test
- FeedFence (c056) — `allowsClayStable` flag not implemented (onBuildStable food works)

---

## Batch 8 — Anytime Actions

Cards needing the anytime action infrastructure. These provide exchanges,
purchases, or actions available on any `choose()` prompt during the player's
turn. Requires extending `getAnytimeActions()` with new action types beyond
the existing `cook`, `card-convert`, and `crop-move`.

### New anytime action types needed

| Type | Description | Cards |
|------|-------------|-------|
| `card-exchange` | Exchange resources at defined rates (not just → food) | HardPorcelain, StableYard, LargePottery |
| `card-purchase` | Pay resources to gain goods/schedule resources | PottersMarket, MuddyPuddles, Mandoline, CornSchnapps, PelletPress |
| `card-convert-vp` | Convert resources to food + bonus VP | Kettle, SculptureCourse, BeerStein |
| `card-field-exchange` | Exchange crops in fields | LandConsolidation, Crudit, Changeover |
| `card-plow` | Plow under specific conditions | RollOverPlow |
| `card-renovate` | Renovate house anytime | Trowel, StoneHouseReconstruction |
| `card-cook` | Cooking conversion (existing type, new rates) | EarthOven |
| `card-build` | Build improvement from stored food | PiggyBank |

### Cards

| Card | Deck | Anytime Effect |
|------|------|----------------|
| **Kettle** (b032)* | B | 1/3/5 grain → 3/4/5 food + 0/1/2 VP |
| **Hard Porcelain** (b080)* | B | 2/3/4 clay → 1/2/3 stone |
| **Potter's Market** (b069)* | B | Pay 3 clay + 2 food → schedule 1 vegetable on next 2 rounds |
| **Muddy Puddles** (b083)* | B | Pay 1 clay → take top good from stack [boar, food, cattle, food, sheep] |
| **Sculpture Course** (b053)* | B | Non-harvest rounds: 1 wood → 2 food OR 1 stone → 4 food |
| **Cookery Lesson** (b029)* | B | Track anytime cooking in same round as Lessons |
| StableYard (c050) | C | 1 sheep + 1 boar → 1 cattle (also food on play) |
| Crudit (c057) | C | Discard 1 vegetable on field with vegetable → 4 food |
| Land Consolidation (c069) | C | 3 grain in field → 1 vegetable in that field |
| Mandoline (c046) | C | Once per round: 1 vegetable → 1 VP + schedule 1 food on next 2 rounds |
| Corn Schnapps Distillery (c064) | C | Once per round: 1 grain → schedule 1 food on next 4 rounds |
| Roll-Over Plow (c018) | C | With 3+ planted fields: discard all goods from 1 field → plow 1 field |
| Changeover (d071) | D | Field with exactly 1 good (after harvest): discard → sow on that field |
| Pellet Press (d046) | D | Once per round: 1 reed → schedule 1 food on next 4 rounds |
| Trowel (d013) | D | Renovate to stone: wood house=1S+1R+1F/room, clay=1S/room |
| Earth Oven (d059) | D | Cooking conversions: veg→3, sheep→2, boar→3, cattle→3; bake: grain→2 |
| Large Pottery (d060) | D | 1 clay → 2 food anytime; endgame 3/5/6/7 clay → 1/2/3/4 VP |
| Stone House Reconstruction (e013) | E | Renovate clay→stone anytime (normal cost, no person needed) |
| Piggy Bank (e027) | E | Store 1 food/work phase; 6 food from card → free major improvement |

**Infrastructure needed**: Extend `getAnytimeActions()` / `executeAnytimeAction()` to support new types. Each type needs its own execution branch. "Once per round" cards need tracking via `game.state`. Field-exchange cards need nested `choose()` for field selection.

---

## Batch 9 — Virtual Fields

Cards that act as fields (isField) with custom sow/harvest behavior.

| Card | Deck | Effect |
|------|------|--------|
| Lettuce Patch (c070) | C | Field for vegetables only; harvested vegetables can become 4 food |
| Wood Field (d075) | D | Plant wood as grain on 2-stack field; harvest wood |
| Crop Rotation Field (e070) | E | Field: harvest last grain → sow vegetable, last vegetable → sow grain |
| Cherry Orchard (e068) | E | Field for wood only (sow/harvest as grain); last wood → 1 vegetable |
| Melon Patch (e069) | E | Field for vegetables only; last vegetable → plow 1 field |
| Artichoke Field (e072) | E | Field: harvest 1+ good → also get 1 food |
| Rock Garden (e080) | E | Plant stone as vegetables on 3-stack field |
| Swing Plow (c019) | C | 4 field tiles on card; Farmland: plow up to 2 from card |
| Turnwrest Plow (d020) | D | 2 field tiles on card; Farmland/Cultivation: plow up to 2 from card |

**Infrastructure needed**: `addVirtualField()` system. `onHarvestLast()` hook for end-of-harvest triggers. `cropRestriction` for type-limited fields. Stone/wood as "crop" types.

**Status**: 3/9 tested (Cherry Orchard, Artichoke Field, Rock Garden). Infrastructure fixes applied:
- Added `canSowAnything()` helper to account for wood/stone sowing in virtual fields
- Fixed sow entry checks in `sow()`, `sowAndOrBake()`, `plowAndOrSow()` to allow sowing when only wood/stone available for virtual fields
- Fixed `harvestFields()` to harvest stone (was missing from harvested resource types)
- Added `virtualFields` support in `setBoard` for pre-sowing virtual fields in tests
- Added `isField` card `onPlay` auto-invocation in `setBoard` for virtual field creation

**Deferred**:
- Lettuce Patch (c070) — missing `offerLettucePatchConversion` method
- Wood Field (d075) — no `onPlay` hook implementation
- Crop Rotation Field (e070) — missing `offerSowOnCard` method
- Melon Patch (e069) — missing `offerFreePlow` method
- Swing Plow (c019) — `plowField` doesn't accept field-from-card options
- Turnwrest Plow (d020) — same as Swing Plow

---

## Batch 10 — Card-Provided Action Spaces

Cards that create new action spaces usable by the owner or all players.

| Card | Deck | Effect |
|------|------|--------|
| Pioneering Spirit (d023) | D | Owner only: rounds 3-5 Renovation; rounds 6-8 choose veg/boar/cattle |
| Archway (d051) | D | All players: 1 food, then before returning home use unoccupied space |
| Alchemist's Lab (e081) | E | All players: get 1 of each building resource you have (others pay 1 food) |
| Job Contract (c023) | C | Use Day Laborer + adjacent Lessons with single person |
| Basket Chair (c022) | C | Move first person to card; place another person immediately |

**Infrastructure needed**: `providesActionSpace` flag, action space creation, `onActionSpaceUsed()` hook. For all-player spaces, need to register in `game.state.activeActions`.

**Status**: 1/5 tested (Pioneering Spirit round 3-5 renovation). Fixed `onActionSpaceUsed` to use `game.state.round` instead of parameter.

**Deferred**:
- Pioneering Spirit (d023) rounds 6-8 — missing `offerPioneeringSpiritChoice()` method
- Archway (d051) — `archwayExtraAction` flag not processed in game engine
- Alchemist's Lab (e081) — uses unsupported `isActionSpace`/`actionSpaceEffect` pattern
- Job Contract (c023) — `allowsCombinedAction` system not implemented
- Basket Chair (c022) — missing `basketChairEffect()` method

---

## Batch 11 — Ongoing State / Modifiers

Cards with ongoing modifier effects or persistent state tracking.

| Card | Deck | Effect |
|------|------|--------|
| Bunk Beds (c010) | C | With 4 rooms, house holds 5 people |
| Cattle Farm (c012) | C | Hold 1 cattle per pasture on card |
| Fishing Net (c051) | C | Others using Fishing pay you 1 food; place 2 food on Fishing at round end |
| Gypsy's Crock (c053) | C | When cooking 2 goods at once: +1 food |
| Huntsman's Hat (c052) | C | Per new boar from action space: +1 food |
| Farmstead (c048) | C | After making unused space used: +1 food |
| Material Hub (c081) | C | Store 2 each building resource; when any player takes 5W/4C/3R/3S: get 1 |
| Firewood (c075) | C | Returning home: +1 wood on card; before build oven: move up to 4 wood |
| Blueprint (c027) | C | Joinery/Pottery/Basketmaker buildable on Minor action, -1 stone |
| Lawn Fertilizer (d011) | D | Size-1 pastures hold 3 animals (6 with stable) |
| Brotherly Love (d024) | D | With 4 people: 3rd+4th person placed consecutively |
| Royal Wood (d074) | D | After Farm Expansion or improvement: 1 wood back per 2 wood paid |
| Bee Statue (e040) | E | Stack [veg, stone, grain, stone, grain]; Day Laborer: take top |
| Whale Oil (e051) | E | Fishing: +1 food on card; before occupation: get all food from card |
| Guest Room (e022) | E | Store food; discard 1 food → place extra person |
| Sheep Rug (e021) | E | Use Wish for Children even if occupied |
| Animal Bedding (e012) | E | +1 animal per unfenced stable; +2 per pasture with stable |
| Herbal Garden (e036) | E | 1 pasture must stay empty (2 VP) |
| Beaver Colony (e033) | E | 1 pasture w/stable can't hold animals; get reed from action space → 1 VP |
| Sour Dough (e062) | E | Once per round: skip person placement → Bake Bread |
| Boar Spear (e053) | E | Get boar outside breeding → can convert to 4 food each |
| Cow Patty (e071) | E | Sow field adjacent to pasture: +1 good |
| Wild Greens (e050) | E | Sow: 1 food per different crop type sowed |
| Cheese Fondue (e057) | E | Bake bread: +1 food if sheep, +1 food if cattle |
| Upholstery (e031) | E | Build/play improvement: 1 reed on card → 1 VP (up to room count) |
| Contraband (e054) | E | Build improvement: pay 1 extra building resource of printed type → 3 food |
| Iron Oven (e063) | E | Bake: 1 grain → 6 food; on build: immediate Bake Bread |
| Simple Oven (e064) | E | Bake: 1 grain → 3 food; on build: immediate Bake Bread |
| Seed Almanac (e018) | E | After playing minor improvement: pay 1 food → plow 1 field |
| Skimmer Plow (e017) | E | Farmland/Cultivation: plow 2 instead of 1; sow: -1 good per field |
| Working Gloves (e060) | E | Occupation cost: 1 building resource replaces up to 2 food |
| Straw Hat (e010) | E | Rounds 3 and 6 work phase end: move Farmland person to unoccupied space |
| Tea Time (e003) | E | Return person from Grain Utilization; place again later |
| Apiary (e023) | E | End of work phase: sow 1 crop on 1 field |
| Sundial (e026) | E | Rounds 7 and 9 work phase end: free Sow action |
| Iron Hoe (e020) | E | End of work phase: if occupy Grain Seeds + Vegetable Seeds, plow 1 field |
| Field Spade (e079) | E | After sow 1+ field: +1 stone |

**Infrastructure needed**: Various. Many need new hooks or modifiers. Categorize further when implementing.

**Status**: 4/many tested (Fishing Net, Carrot Museum, Firewood onReturnHome, Pioneering Spirit).

**Tested cards**:
- Fishing Net (c051) — onAnyAction payment to owner (fishingNetBonus scheduling not yet wired)
- Carrot Museum (d079) — onRoundEnd stone/wood bonus at rounds 8/10/12
- Firewood (c075) — onReturnHome wood accumulation (onBeforeBuildCooking not yet wired)

**Deferred**:
- Bunk Beds (c010) — `modifyHouseCapacity` hook not wired in `canGrowFamily()`
- Cattle Farm (c012) — `holdsCattlePerPasture` flag not processed
- Gypsy's Crock (c053) — `onCook` hook not wired
- Huntsman's Hat (c052) — `onGainBoar` hook not wired
- Farmstead (c048) — `onUseFarmyardSpace` hook not wired
- Material Hub (c081) — `onAnyAction` details parameter needs accumulating action with threshold amounts
- Most D/E deck cards — missing offer methods or unwired hooks

---

## Batch 12 — Remaining minorB (Deferred Infrastructure)

Cards from minorB that were deferred for needing specific infrastructure.

| Card | Deck | Blocker |
|------|------|---------|
| CarpentersBench (b015)* | B | `offerCarpentersBench` — build pasture with taken wood, 1 free fence |
| MiniPasture (b002)* | B | `buildFreeSingleSpacePasture` method |
| Toolbox (b027)* | B | `offerToolboxMajor` — offer Joinery/Pottery/Basketmaker after build |
| AgrarianFences (b026)* | B | `modifyGrainUtilization` flag processing |
| UpscaleLifestyle (b001)* | B | `offerRenovation` method |
| HayloftBarn (b021)* | B | `onGainGrain` hook |
| Hauberg (b041)* | B | `offerHauberg` — alternating wood/boar schedule |
| WoodPalisades (b030)* | B | Wood as fence material support |
| SpecialFood (b034)* | B | `onTakeAnimals` hook with `allAccommodated` param |
| PotteryYard (b031)* | B | `hasAdjacentUnusedSpaces` + `hasPotteryOrUpgrade` prereq |
| Caravan (b010)* | B | `providesRoom` needs family growth E2E test |

---

## Suggested Implementation Order

1. **Batch 1** (On-Play Immediate) — quickest wins, many cards, minimal infrastructure
2. **Batch 2** (Scheduled Resources) — well-established pattern, many cards
3. **Batch 3** (Scoring) — passive, no gameplay bugs possible
4. **Batch 5** (Action-Triggered) — `onAction` hook already works
5. **Batch 6** (Harvest Phase) — many hooks already wired
6. **Batch 4** (Round-Start) — check hook wiring
7. **Batch 7** (Building) — modifier system may need extension
8. **Batch 9** (Virtual Fields) — extends existing virtual field system
9. **Batch 11** (Ongoing State) — mixed complexity, do in sub-batches
10. **Batch 8** (Anytime Actions) — largest infrastructure addition
11. **Batch 10** (Card Action Spaces) — complex, few cards
12. **Batch 12** (Deferred minorB) — each card has unique blockers

---

## Card Counts

| Batch | Cards | Description |
|-------|-------|-------------|
| 1 | 31 | On-Play Immediate |
| 2 | 26 | Scheduled Resources |
| 3 | 20 | Scoring / VP Only |
| 4 | 8 | Round-Start / Returning-Home |
| 5 | 31 | Action-Space Triggered |
| 6 | 27 | Harvest Phase |
| 7 | 20 | Building & Renovation |
| 8 | 19 | Anytime Actions |
| 9 | 9 | Virtual Fields |
| 10 | 5 | Card-Provided Action Spaces |
| 11 | 37 | Ongoing State / Modifiers |
| 12 | 11 | Deferred minorB |
| **Total** | **244** | |

Note: Some cards span multiple batches (e.g., Flail is on-play + action-triggered).
They are listed in the batch matching their primary implementation need.
