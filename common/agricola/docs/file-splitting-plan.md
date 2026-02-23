# File Splitting Plan

Break down the three largest files into focused modules using the prototype-extension
pattern. Target: 200-600 lines per file.

## Pattern

Each extracted file extends the prototype and is required from the parent:

```javascript
// phases/feeding.js
const { Agricola } = require('../agricola')
Agricola.prototype.feedingPhase = function() { ... }
Agricola.prototype.allowFoodConversion = function(player, required) { ... }
```

```javascript
// agricola.js (bottom)
require('./phases/feeding')
require('./phases/harvest')
```

## 1. agricola.js (3588 lines) — Split by game phase

### phases/
| File | Methods | ~Lines |
|------|---------|--------|
| draft.js | draftPhase, draftCardType | ~130 |
| work.js | workPhase, playerTurn, _getSpecialPlacementChoices, _executeSpecialPlacement, getAvailableActions, playerCanUseOccupiedSpace, canTakeAction, registerCardActionSpace | ~500 |
| harvest.js | harvestPhase, fieldPhase | ~160 |
| feeding.js | feedingPhase, allowFoodConversion | ~140 |
| breeding.js | breedingPhase, postBreedingPhase | ~150 |
| replenish.js | replenishPhase, _resetActionSpaces, _handleActivePlayer, _tryAlternativeWorkerSource, _executeArchwayAction | ~200 |
| returnHome.js | returnHomePhase | ~30 |

### util/
| File | Methods | ~Lines |
|------|---------|--------|
| fencing.js | areSpacesConnected, calculateFenceEdges, countFencesNeeded, validatePastureSelection | ~250 |
| actionSpaceQueries.js | isAccumulationSpace, isBuildingResourceAccumulationSpace, isWoodAccumulationSpace, getAccumulationSpaceGoodType, getAccumulatedResources, removeFromAccumulationSpace, hasAccumulationSpaceWith­Goods, isAccumulationSpaceWith5PlusGoods, isRoundActionSpace, getWoodAccumulationSpaces, actionGivesReed, isLastInTurnOrder, isNonAccumulatingActionSpace, actionSpaceProvidesStoneAndOther, isAnimalAccumulationSpace, actionSpaceGivesFood, allClayAccumulationSpacesUnoccupied, getStoneAccumulationSpacesWithStone | ~200 |

### Remaining in agricola.js after extraction (~1800 lines)
- Factory functions, constructor, input processing
- Initialization (initialize, initializePlayers, initializeZones, initializeActionSpaces, etc.)
- Card management (initializeRoundCards, initializeMajorImprovements, initializePlayerCards, etc.)
- Scheduled resources & events
- Anytime actions & food conversion options
- Major improvement queries & special abilities
- End game & scoring
- Main game loop (mainLoop, revealRoundAction)

These can be further split in a second pass if needed.

## 2. AgricolaPlayer.js (4365 lines) — Split by domain

### player/
| File | Methods | ~Lines |
|------|---------|--------|
| farmyard.js | initializeFarmyard, getSpace, setSpace, isSpaceEmpty, getEmptySpaces, rooms (getRoomCount through hasMultiRoomDiscount), renovation (canRenovate through renovate), fields (getFieldCount through plowField) | ~500 |
| pastures.js | getPastureCount, hasPastureAdjacentToHouse, canBuildFences, buildFences, recalculatePastures, findEnclosedArea, hasFenceBetween, isPastureFullyEnclosed, validatePastureSelection, areSpacesConnected, buildPasture, getFenceableSpaces, fence cost/count helpers | ~500 |
| animals.js | getTotalAnimals, getAllAnimals, getAnimalPlacementLocations, canPlaceAnimals, addAnimals, removeAnimals, applyAnimalPlacements, breedAnimals, capacity methods, card animal helpers | ~500 |
| cards.js | hand/occupation/improvement getters/setters, getPlayedCards, hasCard, canAffordCard, meetsCardPrereqs, canPlayCard, payCardCost, playCard, getActiveCards, getCardsWithHook | ~500 |
| cooking.js | getFoodRequired, feedFamily, hasCookingAbility, hasBakingAbility, getCookingImprovement, getBakingImprovement, cookAnimal, cookVegetable, bakeGrain, convertToFood | ~200 |
| scoring.js | getUnusedSpaceCount, getScoreState, getCardPoints, getBonusPoints, calculateScore, getScoreBreakdown, spendResourcesForCraftingBonus | ~200 |
| resources.js | initializeResources, _setupResourceTraps, setResource, addResource, removeResource, hasResource, getResources, addBonusPoints | ~150 |
| sowing.js | canSow, sowField, harvestFields, virtual field methods, getSowableFields, getSownFields | ~300 |
| workers.js | getAvailableWorkers, hasPersonInSupply, useWorker, resetWorkers, resetRoundState, clearNewborns, canGrowFamily, growFamily, getHouseCapacity, family-related methods | ~200 |

## 3. AgricolaActionManager.js (3799 lines) — Split by action category

### actions/
| File | Methods | ~Lines |
|------|---------|--------|
| building.js | buildRoomAndOrStable, buildMultipleRooms, buildRoom, buildStable, renovate, offerRenovation | ~500 |
| farming.js | plowField, _getZigzagPlowSpaces, sow, sowSingleField, bakeBread, sowAndOrBake, plowAndOrSow | ~500 |
| fencing.js | buildFences, selectPastureSpaces, getAdjacentUnselectedSpaces | ~170 |
| cards.js | playOccupation, buyMinorImprovement, buildImprovement, buyImprovement, buyMajorImprovement, _offerSecondMajorFromCard, _offerRecruitmentFamilyGrowth, getAllowedMajorsForMinorAction | ~500 |
| hooks.js | callOnAny*Hooks, offerWoodForFoodExchange, offerBuyBonusPoint, offerBuyAnimal, offerResourceChoice, buildFreeStable, offerExtraPerson, offerBuildStableForWood, offerPlayOccupation, maybePassLeft, houseBuilding, animalMarket, farmSupplies, buildingSupplies, corral, sideJob, offerPlow, improvementSix, returnWorkerHome, buildFreeRoom, familyGrowthWithoutRoom | ~700 |
| familyGrowth.js | familyGrowth | ~60 |
| startingPlayer.js | takeStartingPlayer | ~20 |
| execute.js | executeAction, executeCardActionSpace | ~200 |

## 4. Co-locate tests

After source is split, split agricola.test.js so each module has its own test file
next to it. For example:
- phases/feeding.test.js — feeding/food-conversion tests
- phases/harvest.test.js — harvest tests
- player/animals.test.js — animal placement/capacity tests

## Migration order

1. **agricola.js phases/** — highest value, most frequently edited
2. **agricola.js util/** — pure functions, trivial to extract
3. **AgricolaPlayer.js player/** — largest file, clear domain boundaries
4. **AgricolaActionManager.js actions/** — action dispatch, clear categories
5. **Test co-location** — do after each source split
