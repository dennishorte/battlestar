module.exports = {
  id: "forest-plow-b017",
  name: "Forest Plow",
  deck: "minorB",
  number: 17,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Each time you use a wood accumulation space, you can pay 2 wood to plow 1 field. Place the paid wood on the accumulation space (for the next visitor).",
  onAction(game, player, actionId) {
    if ((actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') && player.wood >= 2) {
      game.actions.offerForestPlow(player, this, actionId)
    }
  },
}
