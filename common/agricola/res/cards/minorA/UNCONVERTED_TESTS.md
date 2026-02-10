# minorA Tests Not Yet Converted to E2E

Tests that still use direct hook calls, mocks, or direct property assertions
instead of the pure `setBoard` / `testBoard` pattern.

---

## Hook Not Connected to Game Engine

These cards use hooks that aren't wired into the game loop, so there's no way
to trigger them via normal gameplay.

| Card | Hook | What It Does |
|------|------|-------------|
| Chapel | `onActionSpaceUsed` | 3 bonus points; non-owner pays 1 grain to owner |
| FireProtectionPond | `checkTrigger` | Schedules 6 food when room type changes from wood |

Previously in this section (now connected and have E2E tests):
FarmyardManure, StableTree (`onBuildStable`), GardenHoe (`onSowVegetables`),
SeedPellets (`onSow`), VegetableSlicer (`onUpgradeFireplace`),
NestSite (`onReedBankReplenish`), PotatoRidger (`onHarvestVegetables`),
ReclamationPlow (`onTakeAnimals`), PottersYard (`onUseSpace`).

## Internal State Not Observable via testBoard

These cards modify internal game state that `testBoard` doesn't check (scheduled
resources, player flags, etc.). The hooks may be connected, but we can't verify
the outcome.

| Card | Hook | State Modified |
|------|------|---------------|
| ClawKnife | `onAction(take-sheep)` | `game.state.scheduledFood` |
| PondHut | `onPlay` | `game.state.scheduledFood` |
| LargeGreenhouse | `onPlay` | `game.state.scheduledVegetables` |
| Trellises | `onPlay` | `game.state.scheduledFood` |
| Telegram | `onPlay` | `game.state.telegramRounds` |
| Handplow | `onPlay` | `game.state.scheduledPlows` |

Note: PondHut, LargeGreenhouse, Trellises, and Telegram trigger via `onPlay`
(connected via Meeting Place). ClawKnife triggers via `onAction` (connected).
But the scheduled effects happen in future rounds, so a single-round E2E test
can't observe them. A multi-round test could verify the food/wood/vegetable
actually arrives.

## Missing Player Methods or Game Actions

These cards reference methods or actions that don't exist on the real player
or game engine.

| Card | Hook | Missing Method/Action |
|------|------|----------------------|
| WheelPlow | `onAction(plow-field)` | `player.isFirstWorkerThisRound()` doesn't exist |
| StoneCompany | `onAction(take-stone)` | `game.actions.buildImprovement()` doesn't exist |
| SwimmingClass | `onReturnHome` | `player.usedFishingThisRound`, `player.getNewbornsReturningHome()` |
| Claypipe | `onReturnHome` | `player.resourcesGainedThisRound` not tracked by engine |

## Complex Mechanics

| Card | Hook | Issue |
|------|------|-------|
| DutchWindmill | `onBake` | Needs baking in the round after a harvest round (multi-round) |
| InterimStorage | `onPlay`, `onAction`, `onRoundStart` | Multi-round store/release cycle; `player.interimStorage` not in testBoard |
| PaperKnife | `onPlay` | Random occupation selection; non-deterministic |
| WoodenShed | `onPlay` | Sets `player.cannotRenovate` flag; could be E2E if we test that renovation is blocked |
| Baseboards | `onPlay` | Gives wood per room; could be E2E via Meeting Place (onPlay is connected) |

## Pure Function / Property Tests

These test static card properties or pure methods with no game flow. They may
be fine as standalone unit tests, or could be replaced by E2E tests that
exercise the same behavior through gameplay.

| Card | What's Tested |
|------|--------------|
| Bassinet | `allowsBassinetPlacement`, `cost` |
| CarpentersHammer | `modifyMultiRoomCost(player, cost, count, roomType)` |
| ClearingSpade | `allowsAnytimeCropMove` |
| DebtSecurity | `getEndGamePoints(player)` |
| DrinkingTrough | `modifyPastureCapacity(player, pasture, capacity)` |
| ForestSchool | `modifyOccupationCost(player, cost)` |
| LumberMill | `modifyImprovementCost(player, cost)` |
| Manger | `getEndGamePoints(player)` |
| OrientalFireplace | `anytimeConversions`, `bakingConversion`, `countsAsMajorOrMinor` |
| RammedClay | `modifyFenceCost()` (also has E2E test) |
| ShiftingCultivation | `onPlay` defined, `cost`, `text` |
| SleepingCorner | `allowOccupiedFamilyGrowth`, `cost`, `vps` |

Already-converted files that also have a pure function test alongside their E2E test:
- DoubleTurnPlow (`getSpecialCost`)
- MudPatch (`allowBoarOnFields`)
- BarleyMill (`cost`, `vps`)
