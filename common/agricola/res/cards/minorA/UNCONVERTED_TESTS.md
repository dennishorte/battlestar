# minorA Tests Not Yet Converted to E2E

Tests that still need `setBoard` / `testBoard` E2E tests. Cards not listed here
already have passing E2E tests.

---

## Hook Not Connected to Game Engine

These cards use hooks that aren't wired into the game loop, so there's no way
to trigger them via normal gameplay.

(none currently)

Previously in this section (now connected and have E2E tests):
FarmyardManure, StableTree (`onBuildStable`), GardenHoe (`onSowVegetables`),
SeedPellets (`onSow`), VegetableSlicer (`onUpgradeFireplace`),
NestSite (`onReedBankReplenish`), PotatoRidger (`onHarvestVegetables`),
ReclamationPlow (`onTakeAnimals`), PottersYard (`onUseSpace`),
FireProtectionPond (`onRenovate`), Chapel (`onActionSpaceUsed`).

## Missing Player Methods or Game Actions

(none currently)

Previously in this section (now have methods and E2E tests):
WheelPlow, StoneCompany, SwimmingClass, Claypipe.

## Complex Mechanics

| Card | Hook | Issue |
|------|------|-------|
| DutchWindmill | `onBake` | Needs baking in the round after a harvest round (multi-round test) |
| InterimStorage | `onPlay`, `onAction`, `onRoundStart` | Multi-round store/release cycle; `player.interimStorage` not in testBoard |
| PaperKnife | `onPlay` | Random occupation selection; non-deterministic |
| WoodenShed | `onPlay` | `requiresMajorImprovementAction`; can't play via Meeting Place |

## Pure Function / Property Tests (no test file)

These cards have no test file. They expose static properties or pure methods
that would need game-flow E2E tests to exercise meaningfully.

| Card | What Needs Testing |
|------|-------------------|
| Bassinet | `allowsBassinetPlacement` flag — need E2E showing extra worker placement |
| CarpentersHammer | `modifyMultiRoomCost` — need E2E building 2+ rooms at once |
| ClearingSpade | `allowsAnytimeCropMove` flag — need E2E moving crops between fields |
| DebtSecurity | `getEndGamePoints` — need E2E checking end-game scoring |
| DrinkingTrough | `modifyPastureCapacity` — need E2E with animals exceeding base capacity |
| ForestSchool | `modifyOccupationCost` + `allowIgnoreLessonsOccupied` — need E2E playing occupation with wood |
| LumberMill | `modifyImprovementCost` — need E2E building improvement with wood discount |
| Manger | `getEndGamePoints` — need E2E checking end-game scoring |
| OrientalFireplace | `anytimeConversions`, `bakingConversion` — need E2E converting goods |
| SleepingCorner | `allowOccupiedFamilyGrowth` — need E2E using occupied Wish for Children |
