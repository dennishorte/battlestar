module.exports = {
  id: "carpenters-axe-a015",
  name: "Carpenter's Axe",
  deck: "minorA",
  number: 15,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Each time after you use a wood accumulation space, if you then have at least 7 wood in your supply, you can build exactly 1 stable for 1 wood.",
  onAction(game, player, actionId) {
    if ((actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') && player.wood >= 7) {
      game.actions.offerBuildStableForWood(player, this, 1)
    }
  },
}
