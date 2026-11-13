# Agricola card format

A card is a CommonJS module under `common/agricola/res/cards/` that exports one object. The engine reads that object. It does not parse `text`. Anything the game should do has to be a field or a function on the object.

```js
module.exports = {
  id: 'joinery',
  name: 'Joinery',
  deck: 'major',
  type: 'major',
  text: 'Harvest: At most 1 time Wood → 2 Food',
  cost: { wood: 2, stone: 2 },
  buildingResourceToFood: 'wood',
}
```

`npm run list-card-fields -w common` prints every shared field, rarest first, with a few card ids that use it. A field that only the declaring card mentions is private and is left out. `npm run list-card-fields -w common -- --check` fails when a shared field is missing from this file. Add the field here in the same commit as the card that introduces it.

Names below in backticks are the exact keys the script looks for.

## Identity

Every card has these.

| Field | Meaning |
| --- | --- |
| `id` | Stable id. Stored games and tests use it. Do not rename a shipped card. |
| `name` | Name shown to players. |
| `deck` | Which deck file it belongs to: `major`, `minorA` through `minorE`, `occupationA` through `occupationE`, or `test`. |
| `type` | `major`, `minor`, or `occupation`. |
| `text` | Printed rules. A string, or an array of strings when the card has several lines. Display only. |

Almost every real card also has `number` (the printed card number; majors omit it). Occupations and some minors have `players`, a string such as `"3+"` for the player-count printed on the card. Minors usually have `category`, a display label such as `"Food Provider"`.

`vps` is victory points printed on a minor. `victoryPoints` is the same idea on a major. `expansion` marks a 5–6 player copy (`"5-6"`). `baseVersions` lists the 1–4 player ids that copy replaces. `excluded` marks a card that version 4 does not deal. Older versions still include it so the shuffled deck stays in the same order. `passLeft` means playing the card passes the new round-start token to the left.

## Cost

`cost` is what the player pays to play or build the card. Each key is a resource and the value is how many.

`cost.wood`, `cost.clay`, `cost.reed`, `cost.stone`, `cost.food`, `cost.grain`, `cost.vegetables`, `cost.sheep`, `cost.boar`.

Two costs are not a pile of goods. `cost.stable` is a number of stables. `cost.special` means the price is computed by `getSpecialCost` on that card.

`costAlternative` is another way to pay. Its keys are `costAlternative.wood`, `costAlternative.clay`, `costAlternative.reed`, `costAlternative.stone`, `costAlternative.food`, `costAlternative.grain`. `costAlternative.cookBoar` means the alternative is to cook a wild boar. `costAlternative2` is a third way to pay; the only key in use is `costAlternative2.stone`.

`alternateCost` is a short label for an upgrade price, such as returning a Fireplace when building a Cooking Hearth. It is display text. The real upgrade link is `upgradesFrom`, the ids of majors this card can replace.

## Prerequisites

`prereqs` is checked before the card can be played. A missing key means that condition is not used. Numbers are minimums unless the name says otherwise.

| Field | Playable when |
| --- | --- |
| `prereqs.occupations` | The player has at least this many occupations. |
| `prereqs.occupationsExact` | Together with `prereqs.occupations`, the count must be exact. |
| `prereqs.exactlyOccupations` | The occupation count must equal this number. |
| `prereqs.occupationsAtMost` | The player has at most this many occupations. |
| `prereqs.noOccupations` | The player has no occupations. |
| `prereqs.occupationsInHand` | The player is holding at least this many occupations. |
| `prereqs.fields` | At least this many fields. |
| `prereqs.fieldsExactly` | Exactly this many fields. |
| `prereqs.grainFields` | At least this many grain fields. |
| `prereqs.vegetableFields` | At least this many vegetable fields. |
| `prereqs.plantedFields` | At least this many sown fields. |
| `prereqs.emptyFields` | At least this many empty fields. |
| `prereqs.unplantedFields` | At least this many empty fields. Same check as `prereqs.emptyFields`. |
| `prereqs.noFields` | The player has no fields. |
| `prereqs.noGrainFields` | The player has no grain fields. |
| `prereqs.pastures` | At least this many pastures. |
| `prereqs.pasturesExact` | Together with `prereqs.pastures`, the count must be exact. |
| `prereqs.stables` | At least this many stables. |
| `prereqs.fencedStables` | At least this many fenced stables. |
| `prereqs.fences` | At least this many fences on the farm. |
| `prereqs.fencesInSupply` | At least this many fences still in supply. |
| `prereqs.rooms` | At least this many rooms. |
| `prereqs.roomCount` | At least this many rooms. |
| `prereqs.roomCountExact` | Together with `prereqs.roomCount`, the count must be exact. |
| `prereqs.houseType` | The house is this type, or one of the types when the value is a list. |
| `prereqs.sheep` | At least this many sheep. |
| `prereqs.sheepExactly` | Exactly this many sheep. |
| `prereqs.boar` | At least this many wild boar. |
| `prereqs.cattle` | At least this many cattle. |
| `prereqs.animals` | At least this many animals of any type. |
| `prereqs.animalTypes` | At least this many different animal types. |
| `prereqs.allAnimalTypes` | The player has sheep, wild boar, and cattle. |
| `prereqs.noAnimals` | The player has no animals. |
| `prereqs.noSheep` | The player has no sheep. |
| `prereqs.grain` | At least this much grain. |
| `prereqs.clay` | At least this much clay. |
| `prereqs.reed` | At least this much reed. |
| `prereqs.stone` | At least this much stone. |
| `prereqs.noGrain` | The player has no grain. |
| `prereqs.maxPeople` | The family is no larger than this. |
| `prereqs.exactlyAdults` | The number of adults (family minus newborns) equals this. |
| `prereqs.improvements` | At least this many improvements in play. |
| `prereqs.majorImprovements` | At least this many major improvements. |
| `prereqs.majorImprovement` | The player has this major improvement id. |
| `prereqs.returnMajor` | The player has one of these major improvement ids. |
| `prereqs.hasFireplaceOrCookingHearth` | The player has a Fireplace or Cooking Hearth. |
| `prereqs.returnFireplaceOrCookingHearth` | The player has a Fireplace or Cooking Hearth. |
| `prereqs.hasPotteryOrUpgrade` | The player has Pottery. |
| `prereqs.bakingImprovement` | The player can bake bread. |
| `prereqs.cookingImprovement` | The player can cook. |
| `prereqs.allFarmyardUsed` | The farmyard has no unused spaces. |
| `prereqs.unusedFarmyard` | At least this many unused farmyard spaces. |
| `prereqs.unusedFarmyardAtMost` | At most this many unused farmyard spaces. |
| `prereqs.maxRound` | The current round is no later than this. |
| `prereqs.minRound` | The current round is no earlier than this. |
| `prereqs.roundIn` | The current round is one of these numbers. |
| `prereqs.personOnFishing` | The player occupies Fishing. |
| `prereqs.personOnAction` | The player occupies the action space with this id. |
| `prereqs.personYetToPlace` | The player still has a person to place. |
| `prereqs.buildingResourcesInSupply` | Wood, clay, reed, and stone add up to at least this. |
| `prereqs.pastureSpacesGteRound` | Pasture spaces are at least the current round number. |
| `prereqs.fieldsInLShape` | The player's fields form an L. |
| `prereqs.noPeopleInHouse` | The family is smaller than the room count. |
| `prereqs.cardsInPlay` | Improvements plus occupations are at least this. |
| `prereqs.maxCardsInPlay` | No player has this many improvements plus occupations. |
| `prereqs.woodGteRound` | Wood in supply is at least the current round number. |
| `prereqs.roundsLeftGreaterThanUnusedSpaces` | Rounds still to come outnumber unused farmyard spaces. |

## Turning a building resource into food

`buildingResourceToFood` marks a card whose effect lets a player turn wood, clay, reed, or stone into food. Wares Salesman reads it when the improvement is built. It does not infer the field from `harvestConversion`, `anytimeConversions`, or the card text.

```js
buildingResourceToFood: 'wood'
buildingResourceToFood: ['wood', 'stone']
```

A string is the one resource. A list means the card can convert more than one kind, and the Wares Salesman player picks exactly one. That player also gets 1 reed. Grain, vegetables, and animals are not building resources, so a card that only converts those does not get this field.

Set it on a new minor or major whenever the printed effect spends a building resource to get food, even if the exchange also gives something else (a bonus point, grain, a later food token). Playing an occupation does not read this field yet. An occupation that turns a building resource into food still needs a play hook before Wares Salesman can see it.

## Other conversions

These fields describe a conversion the engine already knows how to offer. They do not replace `buildingResourceToFood`.

`harvestConversion` is a once-per-harvest exchange. `harvestConversion.resource` is the good spent, `harvestConversion.food` is the food gained, and `harvestConversion.limit` is how many times it can be used this harvest (a number, or a function of the player).

`anytimeConversions` is a list of exchanges the player can make whenever they are choosing. Each entry has `anytimeConversions[].from`, `anytimeConversions[].to`, and `anytimeConversions[].rate`.

`allowsAnytimeConversion` is the same idea in two shapes. One card uses an object: `allowsAnytimeConversion.from`, `allowsAnytimeConversion.to`, and the resource amounts `allowsAnytimeConversion.from.reed` and `allowsAnytimeConversion.to.food`. Another uses a list: `allowsAnytimeConversion[].from`, `allowsAnytimeConversion[].to`, `allowsAnytimeConversion[].from.clay`, and `allowsAnytimeConversion[].to.stone`.

`bakingConversion` is grain turned into food only during Bake Bread. `bakingConversion.from`, `bakingConversion.to`, and `bakingConversion.rate` describe the exchange. `bakingConversion.limit` caps how much grain can be baked at once.

`cookingRates` is food gained for cooking one animal or vegetable: `cookingRates.sheep`, `cookingRates.boar`, `cookingRates.cattle`, `cookingRates.vegetables`.

`endGameExchange` spends goods for bonus points at scoring. `endGameExchange.resource` is the good. `endGameExchange.tiers` is the list of thresholds. Each tier has `endGameExchange.tiers[].cost` and `endGameExchange.tiers[].vp`.

`allowsAnytimeExchange` turns on `exchangeOptions`, a list of trades. Each option has `exchangeOptions[].from` and `exchangeOptions[].to`. Some also have `exchangeOptions[].bonusPoints`. The goods used so far are `exchangeOptions[].from.boar`, `exchangeOptions[].from.clay`, `exchangeOptions[].from.grain`, `exchangeOptions[].from.sheep`, `exchangeOptions[].to.boar`, `exchangeOptions[].to.cattle`, `exchangeOptions[].to.food`, `exchangeOptions[].to.stone`, and `exchangeOptions[].to.vegetables`.

`allowsAnytimeAction` means the card adds choices through `getAnytimeActions`. `allowsAnytimePurchase` means one of those choices buys something. `allowsAnytimeCropMove` means the player can move a crop between fields. `oncePerRound` on an anytime action stops it from being used twice in the same round.

## Board, animals, and scoring flags

These are data, not functions. The engine reads the ones that apply to that card.

A card that adds a space on the board sets `providesActionSpace` and `actionSpaceId`. `ownerOnly` means only the owner may use the space. `createsActionSpace` is the id of a space an occupation adds. `ownerOnly` is also copied onto that space.

`isField` means the card counts as a field.

`holdsAnimals` is how the card holds animals: a boolean, a number, or an object with `holdsAnimals.sheep`, `holdsAnimals.boar`, `holdsAnimals.cattle`, or `holdsAnimals.any`. `holdsAnimalsPerPasture` and `holdsCattlePerPasture` scale that capacity by the player's pastures. `mixedAnimals` allows more than one species. `sameTypeOnly` keeps a shared pen to one species. `requiresAnimalArrangement` asks the player to arrange animals when the card is played. `forceManualAnimalPlacement` makes the player place animals by hand.

`wildcardRoles` lists roles the card can count as, one at a time, such as a field, an occupation, or a Fireplace.

`storedResource` names the good the card holds between rounds. The card display reads it. `freePlayAtWorkPhaseStart` is the round in which the card may be played without an action. `providesRoom` adds room for a person. `providesRoomUntilRound` stops doing that after that round.

`allowedMajors` lists major ids the card lets the player build. `allowsMajorOnMinorAction` lets one major be built on a minor-improvement action. `allowsMajorsOnMinorAction` is the list of majors that can be built that way. `allowsBothMajorsOnMajorAction` lists two majors that can be built together on one major-improvement action.

`canUseTravelingPlayersFood` lets occupation food be paid from the Traveling Players space. `farmRedevelopmentFreeFences` and `houseRedevelopmentDiscount` are numbers another action reads when that card is in play. `futureBuildingSiteRestriction` blocks building on a reserved space. `requiresMajorImprovementAction` means the card can only be played from the Major Improvement action.

`modifiesWorkerPlacement` names a placement rule, such as placing beside another worker. The booleans `allowImmediateOffspringAction`, `allowWoodPalisades`, `allowDirectStoneRenovation`, `allowsDoubleAction`, `modifyGrainUtilization`, `modifyMinorImprovementAction`, and `enablesGuestWorker` turn on the rule in the field's name.

## Functions

A function on the card is either a hook the engine calls, or a helper that card uses itself.

`onPlay` runs when the card is played. Any other `on...` function runs at the moment its name describes: `onAction` after taking an action space, `onHarvest` during harvest, `onRoundStart` at the start of a round, and so on. The engine passes the game, the player, and whatever that moment knows about (the action id, the card just built, the cost just paid).

`matches_onAction` and the other `matches_...` functions are the gate for the hook with the same tail. `matches_onAction` gates `onAction`. Return false when the effect cannot apply, so the game does not log a trigger for nothing. `matches_afterPlayerAction` gates `afterPlayerAction`.

A function that only the declaring card mentions is private. That includes helpers whose names start with `_`, and methods the card names in its own `actionKey` and then calls itself. Those names are not part of this format.

Other function names are methods the engine calls by that exact name: `getAnytimeActions`, `getEndGamePoints`, `activate`, and the rest of the list below. Copy the arguments from a card that already uses that name.

## Every field

The script requires each of these names to appear in this file. Data fields are explained above. A function with no longer note is a hook or method used by the cards the inventory prints.

`actionSpaceId` `allowDirectStoneRenovation` `allowImmediateOffspringAction` `allowWoodPalisades` `allowedMajors` `allowsAnytimeAction` `allowsAnytimeConversion` `allowsAnytimeConversion.from` `allowsAnytimeConversion.from.reed` `allowsAnytimeConversion.to` `allowsAnytimeConversion.to.food` `allowsAnytimeConversion[].from` `allowsAnytimeConversion[].from.clay` `allowsAnytimeConversion[].to` `allowsAnytimeConversion[].to.stone` `allowsAnytimeCropMove` `allowsAnytimeExchange` `allowsAnytimePurchase` `allowsBothMajorsOnMajorAction` `allowsDoubleAction` `allowsMajorOnMinorAction` `allowsMajorsOnMinorAction` `alternateCost` `anytimeConversions` `anytimeConversions[].from` `anytimeConversions[].rate` `anytimeConversions[].to` `bakingConversion` `bakingConversion.from` `bakingConversion.limit` `bakingConversion.rate` `bakingConversion.to` `baseVersions` `buildingResourceToFood` `canUseTravelingPlayersFood` `category` `cookingRates` `cookingRates.boar` `cookingRates.cattle` `cookingRates.sheep` `cookingRates.vegetables` `cost` `cost.boar` `cost.clay` `cost.food` `cost.grain` `cost.reed` `cost.sheep` `cost.special` `cost.stable` `cost.stone` `cost.vegetables` `cost.wood` `costAlternative` `costAlternative.clay` `costAlternative.cookBoar` `costAlternative.food` `costAlternative.grain` `costAlternative.reed` `costAlternative.stone` `costAlternative.wood` `costAlternative2` `costAlternative2.stone` `createsActionSpace` `deck` `enablesGuestWorker` `endGameExchange` `endGameExchange.resource` `endGameExchange.tiers` `endGameExchange.tiers[].cost` `endGameExchange.tiers[].vp` `exchangeOptions` `exchangeOptions[].bonusPoints` `exchangeOptions[].from` `exchangeOptions[].from.boar` `exchangeOptions[].from.clay` `exchangeOptions[].from.grain` `exchangeOptions[].from.sheep` `exchangeOptions[].to` `exchangeOptions[].to.boar` `exchangeOptions[].to.cattle` `exchangeOptions[].to.food` `exchangeOptions[].to.stone` `exchangeOptions[].to.vegetables` `excluded` `expansion` `farmRedevelopmentFreeFences` `forceManualAnimalPlacement` `freePlayAtWorkPhaseStart` `futureBuildingSiteRestriction` `harvestConversion` `harvestConversion.food` `harvestConversion.limit` `harvestConversion.resource` `holdsAnimals` `holdsAnimals.any` `holdsAnimals.boar` `holdsAnimals.cattle` `holdsAnimals.sheep` `holdsAnimalsPerPasture` `holdsCattlePerPasture` `houseRedevelopmentDiscount` `id` `isField` `mixedAnimals` `modifiesWorkerPlacement` `modifyGrainUtilization` `modifyMinorImprovementAction` `name` `number` `oncePerRound` `ownerOnly` `passLeft` `players` `prereqs` `prereqs.allAnimalTypes` `prereqs.allFarmyardUsed` `prereqs.animalTypes` `prereqs.animals` `prereqs.bakingImprovement` `prereqs.boar` `prereqs.buildingResourcesInSupply` `prereqs.cardsInPlay` `prereqs.cattle` `prereqs.clay` `prereqs.cookingImprovement` `prereqs.emptyFields` `prereqs.exactlyAdults` `prereqs.exactlyOccupations` `prereqs.fencedStables` `prereqs.fences` `prereqs.fencesInSupply` `prereqs.fields` `prereqs.fieldsExactly` `prereqs.fieldsInLShape` `prereqs.grain` `prereqs.grainFields` `prereqs.hasFireplaceOrCookingHearth` `prereqs.hasPotteryOrUpgrade` `prereqs.houseType` `prereqs.improvements` `prereqs.majorImprovement` `prereqs.majorImprovements` `prereqs.maxCardsInPlay` `prereqs.maxPeople` `prereqs.maxRound` `prereqs.minRound` `prereqs.noAnimals` `prereqs.noFields` `prereqs.noGrain` `prereqs.noGrainFields` `prereqs.noOccupations` `prereqs.noPeopleInHouse` `prereqs.noSheep` `prereqs.occupations` `prereqs.occupationsAtMost` `prereqs.occupationsExact` `prereqs.occupationsInHand` `prereqs.pastureSpacesGteRound` `prereqs.pastures` `prereqs.pasturesExact` `prereqs.personOnAction` `prereqs.personOnFishing` `prereqs.personYetToPlace` `prereqs.plantedFields` `prereqs.reed` `prereqs.returnFireplaceOrCookingHearth` `prereqs.returnMajor` `prereqs.roomCount` `prereqs.roomCountExact` `prereqs.rooms` `prereqs.roundIn` `prereqs.roundsLeftGreaterThanUnusedSpaces` `prereqs.sheep` `prereqs.sheepExactly` `prereqs.stables` `prereqs.stone` `prereqs.unplantedFields` `prereqs.unusedFarmyard` `prereqs.unusedFarmyardAtMost` `prereqs.vegetableFields` `prereqs.woodGteRound` `providesActionSpace` `providesRoom` `providesRoomUntilRound` `requiresAnimalArrangement` `requiresMajorImprovementAction` `sameTypeOnly` `storedResource` `text` `type` `upgradesFrom` `victoryPoints` `vps` `wildcardRoles`

`actionSpaceAvailable` `activate` `afterFamilyGrowth` `afterPlayerAction` `allowsFamilyGrowthWithoutRoom` `allowsIgnoreOccupied` `anytimeAction` `canBuyVegetable` `canGrowFamily` `canUseActionSpace` `canUseOccupiedActionSpace` `checkTrigger` `consumeFenceCost` `exchange` `getAnimalCapacity` `getAnytimeActions` `getEndGamePoints` `getEndGamePointsAllPlayers` `getFreeFences` `getSpecialCost` `matches_afterPlayerAction` `matches_onAction` `matches_onActionAnnounce` `matches_onActionReplace` `matches_onAfterFinalHarvest` `matches_onAnyAction` `matches_onAnyRenovate` `matches_onBeforeAction` `matches_onBeforeFinalHarvest` `matches_onBeforePlaceAccumulatedAnimals` `matches_onBreedingPhaseEnd` `matches_onBreedingPhaseStart` `matches_onBuildFences` `matches_onBuildImprovement` `matches_onBuildRoom` `matches_onFarmExpansion` `matches_onFeedingPhase` `matches_onFeedingPhaseEnd` `matches_onFieldPhaseEnd` `matches_onFieldSown` `matches_onGainBoar` `matches_onGainWood` `matches_onHarvest` `matches_onHarvestEnd` `matches_onHarvestStart` `matches_onLoseResource` `matches_onObtainResource` `matches_onPersonActionEnd` `matches_onPlayOccupation` `matches_onRenovate` `matches_onReturnHome` `matches_onReturnHomeStart` `matches_onRoundStart` `matches_onSow` `matches_onSowVegetables` `matches_onWorkPhaseStart` `modifyAnyCost` `modifyBuildCost` `modifyFenceCost` `modifyHouseAnimalCapacity` `modifyHouseCapacity` `modifyImprovementCost` `modifyMajorCost` `modifyMultiRoomCost` `modifyOccupationCost` `modifyPastureCapacity` `modifyPlowCount` `modifyRenovation` `modifyRenovationCost` `modifyRoomCapacity` `modifyRoomCost` `modifySheepBreedingRequirement` `modifySowAmount` `modifyStableCapacity` `modifyStableCost` `onAction` `onActionAnnounce` `onActionReplace` `onActionSpaceUsed` `onAfterFinalHarvest` `onAfterSow` `onAnyAction` `onAnyBeforeSow` `onAnyBuildMajor` `onAnyBuildRoom` `onAnyFamilyGrowth` `onAnyPlayImprovement` `onAnyRenovate` `onBake` `onBakeBreadAction` `onBeforeAction` `onBeforeBake` `onBeforeFieldPhase` `onBeforeFinalHarvest` `onBeforeHarvest` `onBeforePlaceAccumulatedAnimals` `onBeforePlayOccupation` `onBeforeRenovateToStone` `onBeforeSow` `onBreedingPhaseEnd` `onBreedingPhaseStart` `onBuildFences` `onBuildImprovement` `onBuildMajor` `onBuildPasture` `onBuildRoom` `onBuildRoomAndStable` `onBuildStable` `onBuy` `onConvertAnimalToFood` `onCook` `onCookAnimal` `onDeclineSow` `onEndFenceAction` `onFamilyGrowthWithoutRoom` `onFarmExpansion` `onFeedingPhase` `onFeedingPhaseEnd` `onFieldPhase` `onFieldPhaseEnd` `onFieldSown` `onGainBoar` `onGainGrain` `onGainWood` `onHarvest` `onHarvestEnd` `onHarvestField` `onHarvestGrain` `onHarvestLast` `onHarvestLastCrop` `onHarvestStart` `onHarvestVegetables` `onLessons` `onLessonsWithCooking` `onLoseResource` `onObtainResource` `onPersonActionEnd` `onPlay` `onPlayOccupation` `onPlowField` `onReedBankReplenish` `onRenovate` `onReturnHome` `onReturnHomeStart` `onRevealRoundCard` `onRoundEnd` `onRoundStart` `onSow` `onSowVegetables` `onStageReveal` `onStartFenceAction` `onStoneActionRevealed` `onTakeAnimals` `onUpgradeFireplace` `onUseCraftConversion` `onUseCreatedSpace` `onUseFarmyardSpace` `onUseMultipleSpaces` `onUseSpace` `onWorkPhaseEnd` `onWorkPhaseStart` `onWouldHarvestGrainField` `useFreeFences`
