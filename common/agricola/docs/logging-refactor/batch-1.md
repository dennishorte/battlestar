# Batch 1: `onAction` hooks (~157 cards)

Priority: High — most noisy, action-gated. These cards check `actionId` and only fire for specific actions.

## Status

All TODO. Cards will be updated incrementally.

## Pattern

```javascript
// Before:
onAction(game, player, actionId) {
  if (actionId !== 'grain-seeds') return
  player.addResource('grain', 1)
  game.log.add({ template: '{player} gets 1 grain from {card}', args: { player, card: this } })
},

// After:
matches_onAction(game, player, actionId) {
  return actionId === 'grain-seeds'
},
onAction(game, player, actionId) {
  player.addResource('grain', 1)
  game.log.add({ template: '{player} gets 1 grain', args: { player } })
},
```

## Cards

To generate the full list, run:
```bash
grep -rl "onAction" common/agricola/res/cards/ | sort
```
