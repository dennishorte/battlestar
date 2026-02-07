module.exports = {
  id: "forest-trader-d125",
  name: "Forest Trader",
  deck: "occupationD",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "Each time you use a wood or clay accumulation space, you can also buy exactly 1 building resource. Wood, clay, and reed cost 1 food each; stone costs 2 food.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-clay' || actionId === 'take-clay-2') {
      game.actions.offerForestTraderPurchase(player, this)
    }
  },
}
