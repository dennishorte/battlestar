module.exports = {
  id: "thresher-c112",
  name: "Thresher",
  deck: "occupationC",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Immediately before each time you use the \"Grain Utilization\", \"Farmland\", or \"Cultivation\" action space, you can buy 1 grain for 1 food.",
  onBeforeAction(game, player, actionId) {
    if ((actionId === 'sow-bake' || actionId === 'plow-field' || actionId === 'plow-sow') && player.food >= 1) {
      game.actions.offerBuyGrain(player, this)
    }
  },
}
