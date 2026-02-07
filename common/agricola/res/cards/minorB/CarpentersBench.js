module.exports = {
  id: "carpenters-bench-b015",
  name: "Carpenter's Bench",
  deck: "minorB",
  number: 15,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Immediately after each time you use a wood accumulation space, you can use the taken wood (and only that) to build exactly 1 pasture. If you do, one of the fences is free.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
      game.actions.offerCarpentersBench(player, this)
    }
  },
}
