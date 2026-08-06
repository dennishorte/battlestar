# Spurious Card Triggers

Cards that log `{card} triggers for {player}` even when their effect cannot apply.

## Cause

`callPlayerCardHook` logs a trigger whenever a card has a phase hook and either:

- has no `matches_<hook>`, or
- `matches_<hook>` returns truthy

Handlers that wrap all work in an `if` / early `return` still produce the log line on every phase fire.

## Fix

Add `matches_<hook>` that returns `false` when the effect cannot apply (same conditions as the handler's gate). Return `'silent'` only if the hook should still run without a trigger line.

See existing examples: `Loom.matches_onHarvest`, `BraidMaker.matches_onHarvest`.

## Status

| Group | Status |
|-------|--------|
| Round / schedule gated | done |
| minorA (condition-gated) | done |
| minorB (condition-gated) | done |
| minorC (condition-gated) | done |
| minorD (condition-gated) | done |
| minorE (condition-gated) | pending |
| occupationA (condition-gated) | pending |
| occupationB (condition-gated) | pending |
| occupationC (condition-gated) | pending |
| occupationD (condition-gated) | pending |
| occupationE (condition-gated) | pending |

---

## Round / schedule gated

Highest confidence — only relevant on specific rounds or scheduled rounds.

| Card | File | Hook | When it actually matters |
|------|------|------|--------------------------|
| Interim Storage | `minorA/InterimStorage.js` | `onRoundStart` | Rounds 7, 11, 14 |
| Asparagus Knife | `minorA/AsparagusKnife.js` | `onReturnHome` | Rounds 8, 10, 12 (+ veg fields) |
| Silage | `minorA/Silage.js` | `onReturnHome` | Non-harvest rounds |
| New Purchase | `minorB/NewPurchase.js` | `onRoundStart` | Harvest rounds (+ food) |
| Mineral Feeder | `minorC/MineralFeeder.js` | `onRoundStart` | Non-harvest rounds (+ sheep) |
| Midnight Fencer | `occupationE/MidnightFencer.js` | `onHarvestStart` | Harvest #6 only |
| Confidant | `occupationB/Confidant.js` | `onRoundStart` | Scheduled sow/fence rounds |
| Tree Farm Joiner | `occupationB/TreeFarmJoiner.js` | `onRoundStart` | Scheduled wood rounds |
| Plowman | `occupationD/Plowman.js` | `onRoundStart` | Scheduled plow rounds |
| Stone Importer | `occupationC/StoneImporter.js` | `onBreedingPhaseEnd` | Per-harvest cost affordability |

## Condition-gated (by deck)

Ungated phase hooks that wrap all work in an `if` / early `return`.

### minorA

| Card | File | Hook |
|------|------|------|
| Ale-Benches | `AleBenches.js` | `onReturnHome` |
| Claypipe | `Claypipe.js` | `onReturnHome` |
| Swimming Class | `SwimmingClass.js` | `onReturnHome` |

### minorB

| Card | File | Hook |
|------|------|------|
| Feedyard | `Feedyard.js` | `onBreedingPhaseEnd` |
| Handcart | `Handcart.js` | `onWorkPhaseStart` |
| Scullery | `Scullery.js` | `onRoundStart` |
| Value Assets | `ValueAssets.js` | `onHarvestEnd` |

### minorC

| Card | File | Hook |
|------|------|------|
| Bed in the Grain Field | `BedInTheGrainField.js` | `onHarvestStart` |
| Beer Table | `BeerTable.js` | `onFieldPhaseEnd` |
| Elephantgrass Plant | `ElephantgrassPlant.js` | `onHarvestEnd` |
| Eternal Rye Cultivation | `EternalRyeCultivation.js` | `onHarvestEnd` |
| Lettuce Patch | `LettucePatch.js` | `onHarvest` |
| Market Stall | `MarketStall.js` | `onFieldPhaseEnd` |

### minorD

| Card | File | Hook |
|------|------|------|
| Bale of Straw | `BaleOfStraw.js` | `onHarvestStart` |
| Changeover | `Changeover.js` | `onFieldPhaseEnd` |
| Civic Facade | `CivicFacade.js` | `onRoundStart` |
| Rolling Pin | `RollingPin.js` | `onReturnHome` |
| Steam Plow | `SteamPlow.js` | `onReturnHome` |
| Stork's Nest | `StorksNest.js` | `onReturnHome` |

### minorE

| Card | File | Hook |
|------|------|------|
| Artichoke Field | `ArtichokeField.js` | `onHarvest` |

### occupationA

| Card | File | Hook |
|------|------|------|
| Bohemian | `Bohemian.js` | `onReturnHomeStart` |
| Curator | `Curator.js` | `onReturnHome` |
| Minstrel | `Minstrel.js` | `onReturnHomeStart` |
| Night-School Student | `NightSchoolStudent.js` | `onReturnHome` |
| Plow Driver | `PlowDriver.js` | `onRoundStart` |
| Scythe Worker | `ScytheWorker.js` | `onHarvest` |
| Turnip Farmer | `TurnipFarmer.js` | `onReturnHomeStart` |

### occupationB

| Card | File | Hook |
|------|------|------|
| Childless | `Childless.js` | `onRoundStart` |
| Forest Scientist | `ForestScientist.js` | `onReturnHome` |
| Groom | `Groom.js` | `onRoundStart` |
| Moral Crusader | `MoralCrusader.js` | `onRoundStart` |
| Nutrition Expert | `NutritionExpert.js` | `onRoundStart` |
| Pavior | `Pavior.js` | `onRoundStart` |
| Scholar | `Scholar.js` | `onRoundStart` |
| Small-scale Farmer | `SmallScaleFarmer.js` | `onRoundStart` |

### occupationC

| Card | File | Hook |
|------|------|------|
| Basket Carrier | `BasketCarrier.js` | `onFieldPhaseEnd` |
| Fisherman's Friend | `FishermansFriend.js` | `onRoundStart` |
| Food Distributor | `FoodDistributor.js` | `onReturnHomeStart` |
| Green Grocer | `GreenGrocer.js` | `onRoundStart` |
| Home Brewer | `HomeBrewer.js` | `onFieldPhaseEnd` |
| Resource Analyzer | `ResourceAnalyzer.js` | `onRoundStart` |
| Seed Researcher | `SeedResearcher.js` | `onReturnHomeStart` |
| Small Animal Breeder | `SmallAnimalBreeder.js` | `onRoundStart` |
| Stone Buyer | `StoneBuyer.js` | `onRoundStart` |
| Winter Caretaker | `WinterCaretaker.js` | `onHarvestEnd` |

### occupationD

| Card | File | Hook |
|------|------|------|
| Bellfounder | `Bellfounder.js` | `onReturnHome` |
| Earthenware Potter | `EarthenwarePotter.js` | `onAfterFinalHarvest` |
| Sample Stable Maker | `SampleStableMaker.js` | `onReturnHomeStart` |
| Transactor | `Transactor.js` | `onBeforeFinalHarvest` |
| Wealthy Man | `WealthyMan.js` | `onHarvestStart` |

### occupationE

| Card | File | Hook |
|------|------|------|
| Acquirer | `Acquirer.js` | `onRoundStart` |
| Animal Driver | `AnimalDriver.js` | `onHarvestStart` |
| Animal Tamer's Apprentice | `AnimalTamersApprentice.js` | `onRoundStart` |
| Bargain Hunter | `BargainHunter.js` | `onRoundStart` |
| Dentist | `Dentist.js` | `onHarvestStart` |
| Entrepreneur | `Entrepreneur.js` | `onRoundStart` |
| Master Fencer | `MasterFencer.js` | `onRoundStart` |
| Omnifarmer | `Omnifarmer.js` | `onHarvest` |
| Pipe Smoker | `PipeSmoker.js` | `onHarvestStart` |
| Recluse | `Recluse.js` | `onRoundStart`, `onHarvestStart` |
| Smuggler | `Smuggler.js` | `onFeedingPhase` |
| Tax Collector | `TaxCollector.js` | `onRoundStart` |
| Uncaring Parents | `UncaringParents.js` | `onHarvestEnd` |

## Probably fine (excluded)

No `matches_*`, but the handler always offers a choice / effect when the hook fires:

- **Lunchtime Beer** (`onHarvestStart`) — always presents skip/normal choice
- **Begging Student** (`onHarvestStart`) — always offers free occupation
