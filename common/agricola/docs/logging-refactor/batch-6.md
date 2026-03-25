# Batch 6: `onBuild*` / `onRenovate` / `onSow` hooks (~53 cards)

Priority: Medium.

## Sub-hooks

| Hook | Count |
|------|-------|
| `onBuildImprovement` | 13 |
| `onBuildRoom` | 10 |
| `onBuildStable` | 8 |
| `onBuildFences` | 5 |
| `onRenovate` | 14 |
| `onSow` | 3 |

Generate full list:
```bash
grep -rl "onBuild\|onRenovate\|onSow" common/agricola/res/cards/ | sort
```
