# MinorB E2E Test Plan

84 cards total. All tests use `t.setBoard` / `game.run()` / `t.choose` / `t.testBoard`.

## Batch 1: Simple On-Play Effects (10 cards)

Cards that give immediate resources or food when played, with no hooks or ongoing effects. Straightforward to test: set up prereqs, play the card via an occupation/improvement action, and assert the resource gain.

- **Wage** (b007) - Get 2 food + 1 per bottom-row major improvement
- **BeatingRod** (b009) - Choose: get 1 reed OR exchange 1 reed for 1 cattle
- **ExcursionToTheQuarry** (b006) - Get stone equal to family members (cost: 2 food, prereq: 1 occ)
- **WoodPile** (b004) - Get wood equal to people on accumulation spaces
- **StoreOfExperience** (b005) - Get resource based on occupations in hand (branching)
- **FoodChest** (b059) - Get 4 food if played on Major Improvement space; 2 food otherwise
- **BreadPaddle** (b025) - Get 1 food when played; extra Bake Bread per occupation
- **MiningHammer** (b016) - Get 1 food when played; free stable when renovating
- **CrackWeeder** (b058) - Get 1 food when played; harvest: 1 food per vegetable taken
- **Tumbrel** (b054) - Get 2 food when played; after Sow: food = stable count

## Batch 2: Scheduled Deliveries (12 cards)

Cards that schedule resources on future rounds. Test by playing the card, then advancing rounds to verify delivery via `t.testBoard` with `scheduled` assertions.

- **ChickStable** (b044) - Schedule 2 food on rounds 3 & 4
- **StrawberryPatch** (b045) - Schedule 1 food on next 3 rounds (prereq: 2 veg fields)
- **ClubHouse** (b046) - Schedule 1 food on next 4 rounds + 1 stone on round +5
- **HerringPot** (b047) - Schedule 1 food on next 3 rounds after Fishing
- **SackCart** (b066) - Schedule 1 grain on rounds 5, 8, 11, 14
- **ReedBelt** (b078) - Schedule 1 reed on remaining rounds 5, 8, 10, 12
- **ThickForest** (b074) - Schedule 1 wood on even rounds 2-14 (prereq: 5 clay)
- **Ceilings** (b076) - Schedule 1 wood on 5 rounds; renovation removes them
- **ChainFloat** (b020) - Schedule plows for rounds 7, 8, 9
- **GrainDepot** (b065) - Schedule grain on 2/3/4 rounds depending on payment type
- **AcornsBasket** (b084) - Schedule 1 boar on 2 round spaces
- **Hawktower** (b014) - Schedule free stone room for round 12 if stone house (maxRound: 7)

## Batch 3: Action Space Hooks (11 cards)

Cards that trigger when specific action spaces are used. Test by setting up the card, taking the triggering action, and asserting the bonus effect.

- **Brook** (b056) - Reed Bank/Clay Pit/Forest/round-1 card: get 1 food (prereq: person on Fishing)
- **BreweryPond** (b040) - Fishing/Reed Bank: also get 1 grain + 1 wood (prereq: 2 occ)
- **ForestPlow** (b017) - After wood accumulation, pay 2 wood to plow 1 field
- **ForestryStudies** (b028) - After Forest, return 2 wood to play 1 occupation free
- **CookeryLesson** (b029) - Bonus point when using Lessons + cooking improvement same turn
- **Pitchfork** (b062) - Grain Seed + Farmland occupied: get 3 food
- **MillWheel** (b064) - Grain Utilization while Fishing occupied: get 2 food
- **LoamPit** (b077) - Day Laborer: get 3 clay (prereq: 3 occ)
- **DiggingSpade** (b051) - Clay accumulation: get food = boar count
- **HandTruck** (b067) - Bake Bread: get grain = people on accumulation spaces
- **Chophouse** (b043) - Grain/Vegetable Seed: schedule 3/2 food on next rounds

## Batch 4: Harvest Hooks (8 cards)

Cards that trigger during harvest phases. Test by setting `round: 4` (first harvest) and asserting post-harvest state.

- **ButterChurn** (b050) - Harvest: 1 food per 3 sheep + 1 per 2 cattle
- **Loom** (b039) - Harvest: food based on sheep count; end-game: 1 bp per 3 sheep
- **ThreeFieldRotation** (b061) - Harvest: 3 food if have grain field + veg field + empty field
- **NewPurchase** (b070) - Harvest round start + 2+ food: buy 1 grain or 1 veg
- **ValueAssets** (b082) - Harvest end + 1+ food: buy wood/clay/reed/stone with food
- **Scullery** (b057) - Round start: get 1 food if in wood house
- **CarpentersParlor** (b013) - Wooden rooms cost 2 wood + 2 reed instead of normal
- **GrasslandHarrow** (b018) - Schedule plow for round = current + building resources in supply

## Batch 5: Scoring & VP Cards (8 cards)

Cards with end-game bonus points or VP conditions. Test with `score` assertions in `t.testBoard`.

- **PotteryYard** (b031) - 2 bonus points if 2+ adjacent unused spaces (prereq: pottery)
- **Mantlepiece** (b033) - 1 bonus point per remaining round; cannot renovate
- **Bottles** (b036) - Pay 1 clay + 1 food per family member for 4 VP
- **Grange** (b037) - 3 VP (prereq: 6 fields, all animal types)
- **WoodPalisades** (b030) - Place 2 wood on fence spaces (each = 1 bonus point)
- **GiftBasket** (b073) - Room-based reward: 2 rooms -> 1 veg, etc.
- **HookKnife** (b035) - Once: 2 bp when reaching sheep threshold
- **SpecialFood** (b034) - Once: 1 bp per animal when taking animals & all fit

## Batch 6: Anytime Exchanges (4 cards)

Cards that allow conversions at any time. Test by verifying anytime action availability and results.

- **Kettle** (b032) - Anytime: grain -> food conversions at various rates with bonus points
- **HardPorcelain** (b080) - Anytime: 2 clay -> 1 stone
- **PottersMarket** (b069) - Anytime: pay 3 clay + 2 food to schedule 1 veg on 2 rounds
- **SculptureCourse** (b053) - Non-harvest rounds: 1 wood -> 2 food OR 1 stone -> 4 food

## Batch 7: Food Drip & State Tracking (8 cards)

Cards that provide ongoing food income or track internal state (food stacks, charge counters). Slightly more involved setup to verify state transitions.

- **MaintenancePremium** (b055) - Place 3 food; wood accumulation: get 1; renovation: restock
- **ForestStone** (b048) - Place 2 food on card; wood acc: take 1; stone acc: add 2
- **Scales** (b049) - Get 2 food when improvements = occupations (prereq: no occ)
- **BrewingWater** (b060) - Fishing: pay 1 grain to schedule 1 food on 6 rounds
- **Handcart** (b081) - Work phase start: take 1 building resource if 6/5/4/4+ of type
- **Corf** (b079) - Any player takes 3+ stone: you get 1 stone
- **WoodWorkshop** (b075) - Before building improvement: get 1 wood
- **GrowingFarm** (b052) - Requires pasture spaces >= round; get food = round

## Batch 8: Building & Farmyard Modifiers (7 cards)

Cards that modify building actions or farmyard usage. Need pasture/fence/room setup in tests.

- **CarpentersBench** (b015) - After wood accumulation, build 1 pasture with 1 free fence
- **MiniPasture** (b002) - Build single-space pasture for free
- **Stockyard** (b012) - Hold 3 animals of same type only
- **Beanfield** (b068) - Vegetable-only virtual field
- **Toolbox** (b027) - After building room/stable/fence, offer Joinery/Pottery/Basketmaker
- **AgrarianFences** (b026) - Replace one Grain Utilization action with Build Fences
- **MarketStall** (b008) - Exchange 1 grain for 1 vegetable (passLeft)

## Batch 9: Complex / Multi-Mechanic Cards (6 cards)

Cards with multiple interacting mechanics, internal state machines, or unusual control flow. Need more elaborate multi-round setups.

- **UpscaleLifestyle** (b001) - Get 5 clay + offer renovation (cost: 3 wood)
- **MoldboardPlow** (b019) - 2-charge system; onAction hook triggers plow on Farmland
- **HayloftBarn** (b021) - 4-food stack; onGainGrain depletes; family growth when empty
- **Caravan** (b010) - Provides room for 1 person
- **HarvestHouse** (b071) - Reward if completed harvests = occupations played
- **Hauberg** (b041) - Alternating 2-wood / 1-boar schedule with player choice of start

---

## Difficult Cards (to be addressed last)

These cards involve mechanics that are hard to test in isolation, require unusual game state manipulation, or interact with systems that may not be fully exercised by the standard test patterns. Each needs discussion before writing tests.

### Moonshine (b003)
Plays a random occupation from hand. The randomness makes deterministic assertions difficult — need to either seed the random selection or test around it. Also involves a choice between playing the occupation (for 2 food) or passing it to the left player.

### WalkingBoots (b022)
Adds a temporary person for one round who must be placed on an action space and removed during return home. Testing the temporary placement + removal lifecycle requires playing a full round and verifying the family member count reverts. Interacts with the worker placement system at a deep level.

### FinalScenario (b023)
Claims exclusive access to the round 14 action space. Testing requires reaching round 14 or verifying the exclusive claim mechanism. The card's maxRound: 13 constraint means it must be played before round 14 — verifying exclusion of other players from a future round's action space is unusual.

### Lasso (b024)
Enables placing 2 consecutive workers if one uses an animal market. This fundamentally alters turn order within a round — the player gets two turns in a row. Testing double placement requires verifying the turn order change and that both actions resolve correctly.

### ForestInn (b042)
A player-provided action space with exchange tiers (5/7/9 wood -> 8 wood + 2/4/7 food). Non-owners pay 1 food. Testing requires verifying the action space appears, the exchange math at each tier, and the owner vs non-owner cost difference.

### Feedyard (b011)
Holds 1 animal per pasture; gives 1 food per empty spot after breeding. Testing the breeding-phase hook interaction requires setting up pastures with animals, triggering breeding, and verifying the food reward for unused capacity. Interacts deeply with the animal/pasture system.

### LoveForAgriculture (b072)
Allows sowing crops in 1-2 space pastures (reducing animal capacity). Testing requires building pastures, sowing into them, and verifying the animal capacity reduction. Bridges the sowing and pasture systems in an unusual way.

### MuddyPuddles (b083)
Stack-based anytime purchase: boar, food, cattle, food, sheep. Pay 1 clay for top item. Testing the stack depletion order and anytime action trigger requires multiple purchases across turns. Stack state is internal to the card.

### Feedyard + Loom (cross-card note)
Both Feedyard and Loom interact with animals during harvest/breeding. If tests for these cards are written, they should be carefully designed to not accidentally depend on each other's behavior.
