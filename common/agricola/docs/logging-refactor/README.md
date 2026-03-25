# Agricola Card Hook Logging Refactor

## Goal

Add `matches_hookName` methods to card definitions to gate trigger logging. Only show `"{card} triggers for {player}"` when the card will actually do something. Also fix internal card logging to remove redundant `{card}` / `from {card}` references.

## Architecture

See `common/docs/logging.md` → "Card Hook Trigger Logging" section.

## Framework

- [x] `cardManagement.js` — `_checkCardMatch`, updated `callPlayerCardHook`/`callPlayerCardHookOrdered`, `onPlay` exclusion
- [x] `common/docs/logging.md` — Best practices updated

## Batch Status

| Batch | Hook type | Card count | Status |
|-------|-----------|------------|--------|
| 1 | `onAction` | ~157 | DONE |
| 2 | `afterPlayerAction` | ~6 | DONE |
| 3 | `onHarvest`, `onHarvestGrain`, `onHarvestVegetables` | ~20 | DONE |
| 4 | `onWorkPhaseStart` | ~10 | DONE |
| 5 | `onFeedingPhase`, `onFeedingPhaseEnd` | ~19 | DONE |
| 6 | `onBuild*`, `onRenovate`, `onSow` | ~53 | DONE |
| 7 | `onBreedingPhase*` | ~7 | DONE |
| 8 | `onBefore*` | ~27 | DONE |
| 9 | `onGain*`, `onActionReplace`, misc | ~5 | DONE |
