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
| 1 | `onAction` | ~157 | TODO |
| 2 | `afterPlayerAction` | ~6 | TODO |
| 3 | `onHarvest`, `onHarvestGrain`, `onHarvestVegetables` | ~20 | TODO |
| 4 | `onWorkPhaseStart` | ~10 | TODO |
| 5 | `onFeedingPhase`, `onFeedingPhaseEnd` | ~19 | TODO |
| 6 | `onBuild*`, `onRenovate`, `onSow` | ~53 | TODO |
| 7 | `onBreedingPhase*` | ~7 | TODO |
| 8 | `onBefore*` | ~27 | TODO |
| 9 | `onGain*`, `onActionReplace`, misc | ~5 | TODO |
