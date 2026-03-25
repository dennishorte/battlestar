module.exports = {
  id: "carpenters-axe-a015",
  name: "Carpenter's Axe",
  deck: "minorA",
  number: 15,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Each time after you use a wood accumulation space, if you then have at least 7 wood in your supply, you can build exactly 1 stable for 1 wood.",
  matches_onAction(game, player, actionId) {
    return game.isWoodAccumulationSpace(actionId)
  },
  onAction(game, player, _actionId) {
    if (player.wood >= 7) {
      game.actions.offerBuildStableForWood(player, this, 1)
    }
  },
}
