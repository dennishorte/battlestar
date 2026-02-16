# Remaining OccupationD Cards — Implementation Plan

40 cards remain (1 excluded: PigStalker). 43 already have passing tests.

**Rule:** No new one-off ActionManager methods. Inline card logic directly.

---

## Summary by Effort Level

| Group | Cards | Effort | Description |
|-------|-------|--------|-------------|
| A | 8 | Low | Wired hooks, trivial fixes (method rename, API fix) |
| B | 14 | Medium | Wired hooks, card rewrite needed (inline non-existent ActionManager methods) |
| C | 10 | Medium-High | Unwired hooks need wiring + card rewrite |
| D | 5 | High | Engine feature support (cost substitution flags, action space) |
| E | 3 | High | Complex worker manipulation / timing-sensitive |

---

## Group A: Trivial Fixes + Tests (8 cards)

Cards using already-wired hooks. Only need small fixes like method name corrections.

| # | Card | ID | Hook(s) | Fix Needed |
|---|------|----|---------|-----------|
| 1 | BeggingStudent | d097 | `onPlay`, `onHarvestStart` | Fix `offerFreeOccupation` → `offerFreeOccupations` (exists, plural + maxCount param) |
| 2 | Stablehand | d089 | `onBuildFences` | Fix `offerBuildFreeStable` → `buildFreeStable` (exists) |
| 3 | PlowMaker | d090 | `onAction` | Fix `game.actions.offerPlowForFood` → `game.offerPlowForFood` (exists on prototype) |
| 4 | Plowman | d091 | `onPlay`, `onRoundStart` | Fix `game.actions.offerPlowForFood` → `game.offerPlowForFood`; `scheduleEvent` exists |
| 5 | Bonehead | d118 | `onPlay`, `onPlayCard` | `onPlayCard` not wired but card can be rewritten: track count in `onPlay` + use existing `onBeforePlayOccupation`/`afterPlayerAction` |
| 6 | HideFarmer | d132 | `onScoring` | `onScoring` not wired; rewrite as `getEndGamePoints` (already-supported hook) |
| 7 | FodderPlanter | d115 | `onBreedingPhase` | `onBreedingPhase` not wired; rewrite to use `onBreedingPhaseEnd` (exists, receives `newbornTypes`). Fix `hasEmptyFields` → `getEmptyFields().length > 0` |
| 8 | SampleStableMaker | d102 | `onReturnHomeStart` | Fix `getBuiltStableCount` → `getStableCount`; inline return logic |

---

## Group B: Card Rewrite — Wired Hooks (14 cards)

Cards using already-wired hooks but calling non-existent ActionManager methods.
Need to inline the logic (use `game.actions.choose()`, `player.addResource()`, etc.).

| # | Card | ID | Hook(s) | What to Inline |
|---|------|----|---------|---------------|
| 1 | BeerTentOperator | d133 | `onFeedingPhase` | Food conversion offer (choose to convert grain/veg to food at favorable rate) |
| 2 | Bellfounder | d107 | `onReturnHome` | Resource exchange offer |
| 3 | BuildingTycoon | d128 | `onAnyBuildRoom` | Offer to build a room when opponent builds |
| 4 | CabbageBuyer | d161 | `onAnyRenovate` | Offer to buy vegetable for food when anyone renovates |
| 5 | CasualWorker | d149 | `onAnyAction` | When opponent takes stone, get +1 stone or +1 food |
| 6 | Ebonist | d155 | `onHarvest` | Wood-to-food conversion offer during harvest |
| 7 | FoodMerchant | d113 | `onHarvestGrain` | Offer to buy vegetable when harvesting grain |
| 8 | ForestTrader | d125 | `onAction` | Offer to trade wood for other resources on wood/clay spaces |
| 9 | LumberVirtuoso | d129 | `onHarvest` | Offer to build/upgrade using wood during harvest |
| 10 | PureBreeder | d167 | `onPlay`, `onRoundEnd` | Offer extra breeding on non-harvest rounds |
| 11 | StoneCarver | d108 | `onHarvest` | Stone-to-food conversion during harvest |
| 12 | SugarBaker | d101 | `onAction` | Bonus when using bake-bread-related actions |
| 13 | TradeTeacher | d137 | `onAction` | Resource trade offer after certain actions |
| 14 | WoodBarterer | d119 | `onBeforeAction` | Offer to trade wood before taking an action |

---

## Group C: Hook Wiring + Card Rewrite (10 cards)

These use hooks NOT yet wired in the engine. Need to:
1. Wire the hook in `agricola.js` or `AgricolaActionManager.js`
2. Rewrite card to inline logic

| # | Card | ID | Missing Hook | Where to Wire |
|---|------|----|-------------|--------------|
| 1 | ChildOmbudsman | d092 | `onPersonActionEnd` | After each person placement in `playerTurn()` — fire after action resolves, before next person |
| 2 | SheepInspector | d093 | `onPersonActionEnd` | Same as ChildOmbudsman — shared hook |
| 3 | EarthenwarePotter | d099 | `onAfterFinalHarvest` | After final harvest (round 14) completes |
| 4 | Transactor | d098 | `onBeforeFinalHarvest` | Before final harvest starts (round 14) |
| 5 | FieldCultivator | d126 | `onHarvestField` | In `fieldPhase()`, per-field after crop is harvested |
| 6 | PartyOrganizer | d157 | `onAnyFamilyGrowth` | In family growth actions, after baby is added |
| 7 | TreeInspector | d116 | `onRevealRoundCard` | In `mainLoop()`, after round card is revealed |
| 8 | CanalBoatman | d103 | N/A (hook wired) | Fix `hasAvailableWorker` → `getAvailableWorkers() > 0`; inline placement logic |
| 9 | PetLover | d138 | N/A (hook wired) | Fix `getAccumulatedAnimalCount` (doesn't exist) → use `getAccumulatedResources`; inline choice |
| 10 | YoungFarmer | d112 | N/A (hook wired) | Inline sow logic (no `offerSow` method) |

Note: CanalBoatman, PetLover, and YoungFarmer use wired hooks but have enough issues to warrant grouping here.

---

## Group D: Engine Feature Support (5 cards)

Cards requiring new engine capabilities beyond hook wiring.

| # | Card | ID | Feature Needed |
|---|------|----|---------------|
| 1 | Millwright | d088 | `allowsGrainSubstitution` flag — engine must check active cards during building cost calculation and allow grain to substitute for wood/clay/stone/reed |
| 2 | WoodExpert | d117 | `allowsFoodForWoodSubstitution` flag — engine must check active cards and allow food to substitute for wood in building costs |
| 3 | SiteManager | d095 | On play, offer to build a major improvement with food substituting for some cost — needs inline flow that modifies cost then calls existing improvement building |
| 4 | RecreationalCarpenter | d130 | `onWorkPhaseEnd` — needs tracking of whether player used Starting Player space this round (`player._usedStartingPlayerThisRound`); inline room-building offer |
| 5 | HardworkingMan | d127 | Custom action space card (`isActionSpace`, `actionSpaceEffect`) — personal action space that offers Day Laborer + Build Room + Build Major. Complex multi-step action. |

### Cost Substitution Engine Work (Millwright + WoodExpert)

Both cards use declarative flags that modify building costs. The engine needs:
1. In `canAffordCard()` / room-building cost check: scan active cards for substitution flags
2. Allow the substitution when calculating/paying costs
3. Millwright: 1 grain can replace 1 of any building resource
4. WoodExpert: 1 food can replace 1 wood

This is a shared engine feature — probably worth implementing as a `modifyBuildingCost` hook or checking the flags directly in the cost calculation code.

---

## Group E: Complex Worker Manipulation (3 cards)

Cards that manipulate worker placement timing. Require careful integration.

| # | Card | ID | Complexity |
|---|------|----|-----------|
| 1 | GodlySpouse | d150 | `onAction` — after family growth, return first worker home. Needs `returnWorkerHome` logic (move person from action space back to supply). |
| 2 | HenpeckedHusband | d094 | `onAction` — after build-rooms with 2nd person, return 1st person home. Needs `getFirstPersonActionThisRound` + `returnWorkerHome`. |
| 3 | SpinDoctor | d151 | `onAction` — after certain actions, place an additional worker. Needs `hasAvailableWorker` → `getAvailableWorkers() > 0` + inline placement logic. Similar to existing `modifiesWorkerPlacement` system. |

### Worker Return Home Logic

GodlySpouse and HenpeckedHusband both need `returnWorkerHome(player, personIndex)`:
- Remove person from the action space they occupy
- Return to player's supply (increment available workers)
- This is a new engine capability — could be a shared helper on the game or player

---

## Suggested Implementation Order

### Phase 1: Group A (8 cards) — Quick Wins
Trivial fixes, all hooks wired. Can be done in 1 session.

### Phase 2: Group B (14 cards) — Card Rewrites
All use wired hooks. Main work is understanding each card's intent and inlining the `offerXxx` logic. Can be parallelized across 2-3 batches.

### Phase 3: Group C (10 cards) — Hook Wiring
Wire 6 new hooks in engine:
- `onPersonActionEnd` (in `playerTurn`, after action resolves)
- `onAfterFinalHarvest` / `onBeforeFinalHarvest` (in harvest flow, round 14 check)
- `onHarvestField` (in `fieldPhase`, per field)
- `onAnyFamilyGrowth` (in family growth actions)
- `onRevealRoundCard` (in `mainLoop`, after card reveal)

Then rewrite + test the cards.

### Phase 4: Group D (5 cards) — Engine Features
- Implement cost substitution support (Millwright, WoodExpert)
- Implement personal action space support if not already working (HardworkingMan)
- SiteManager and RecreationalCarpenter need smaller targeted features

### Phase 5: Group E (3 cards) — Worker Manipulation
- Implement `returnWorkerHome` helper
- Carefully test timing of GodlySpouse, HenpeckedHusband
- SpinDoctor may leverage existing `modifiesWorkerPlacement` system

---

## Hook Wiring Reference

Hooks that need to be added to the engine for these cards:

| Hook | Where to Wire | Signature | Used By |
|------|--------------|-----------|---------|
| `onPersonActionEnd` | `playerTurn()` in agricola.js, after action execution | `(game, player)` | ChildOmbudsman, SheepInspector |
| `onAfterFinalHarvest` | `harvestPhase()`, after final harvest (round 14) | `(game, player)` | EarthenwarePotter |
| `onBeforeFinalHarvest` | `harvestPhase()`, before final harvest (round 14) | `(game, player)` | Transactor |
| `onHarvestField` | `fieldPhase()`, per field harvested | `(game, player, cropType, amount)` | FieldCultivator |
| `onAnyFamilyGrowth` | Family growth actions in ActionManager | `(game, actingPlayer, cardOwner)` | PartyOrganizer |
| `onRevealRoundCard` | `mainLoop()`, after round card is revealed | `(game, player, card)` | TreeInspector |

---

## Method Fixes Quick Reference

| Wrong Call | Correct Call | Cards Affected |
|-----------|-------------|---------------|
| `game.actions.offerFreeOccupation()` | `game.actions.offerFreeOccupations(player, card, 1)` | BeggingStudent |
| `game.actions.offerBuildFreeStable()` | `game.actions.buildFreeStable(player, card)` | Stablehand |
| `game.actions.offerPlowForFood()` | `game.offerPlowForFood(player, card, foodCost)` | PlowMaker, Plowman |
| `player.getBuiltStableCount()` | `player.getStableCount()` | SampleStableMaker |
| `player.hasAvailableWorker()` | `player.getAvailableWorkers() > 0` | CanalBoatman, SpinDoctor |
| `player.hasEmptyFields()` | `player.getEmptyFields().length > 0` | FodderPlanter |
| `player.hasRoomForFamilyGrowth()` | `player.canGrowFamily()` | ChildOmbudsman |
| `game.getAccumulatedAnimalCount()` | Use `game.getAccumulatedResources()` | PetLover |
