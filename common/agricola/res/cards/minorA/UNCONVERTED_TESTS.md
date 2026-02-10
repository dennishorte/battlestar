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
| ClearingSpade | `allowsAnytimeCropMove` | "Anytime" crop move between fields; needs new interaction pattern |
| InterimStorage | `onPlay`, `onAction`, `onRoundStart` | Multi-round store/release cycle; `player.interimStorage` not in testBoard |
| PaperKnife | `onPlay` | Random occupation selection; non-deterministic |
| WoodenShed | `onPlay` | `requiresMajorImprovementAction`; can't play via Meeting Place |

## Pure Function / Property Tests (no test file)

(none currently)

Previously in this section (now have E2E tests):
CarpentersHammer, DebtSecurity, DrinkingTrough, ForestSchool, LumberMill,
Manger, OrientalFireplace, SleepingCorner.
