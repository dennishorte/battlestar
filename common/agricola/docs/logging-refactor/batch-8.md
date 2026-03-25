# Batch 8: `onBefore*` hooks (~27 cards)

Priority: Low.

## Sub-hooks

| Hook | Count |
|------|-------|
| `onBeforeAction` | 12 |
| `onBeforePlayOccupation` | 4 |
| `onBeforeHarvest` | 3 |
| `onBeforeBake` | 3 |
| `onBeforeSow` | 1 |
| `onBeforeBuildCooking` | 1 |
| `onBeforeFieldPhase` | 1 |
| `onBeforeRenovateToStone` | 1 |
| `onBeforeFinalHarvest` | 1 |

Generate full list:
```bash
grep -rl "onBefore" common/agricola/res/cards/ | sort
```
