module.exports = {
  id: "cattle-feeder-b166",
  name: "Cattle Feeder",
  deck: "occupationB",
  number: 166,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Grain Seeds\" action space, you can also buy 1 cattle for 1 food.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain'
  },
  onAction(game, player, _actionId) {
    if (player.food >= 1 && player.canPlaceAnimals('cattle', 1)) {
      game.actions.offerBuyAnimal(player, this, 'cattle', 1)
    }
  },
}
