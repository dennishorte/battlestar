module.exports = {
  id: "sugar-baker-d101",
  name: "Sugar Baker",
  deck: "occupationD",
  number: 101,
  type: "occupation",
  players: "1+",
  text: "Each time after you use the \"Grain Utilization\" action space, you can buy 1 bonus point for 1 food. Place the food on the action space (for the next visitor).",
  onAction(game, player, actionId) {
    if (actionId === 'sow-bake' && player.food >= 1) {
      game.actions.offerSugarBakerBonus(player, this)
    }
  },
}
