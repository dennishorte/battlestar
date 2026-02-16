module.exports = {
  id: "plow-maker-d090",
  name: "Plow Maker",
  deck: "occupationD",
  number: 90,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Farmland\" or \"Cultivation\" action space, you can pay 1 food to plow 1 additional field.",
  onAction(game, player, actionId) {
    if ((actionId === 'plow-field' || actionId === 'plow-sow') && player.food >= 1) {
      game.offerPlowForFood(player, this)
    }
  },
}
