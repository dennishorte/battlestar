module.exports = {
  id: "cattle-feeder-b166",
  name: "Cattle Feeder",
  deck: "occupationB",
  number: 166,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Grain Seeds\" action space, you can also buy 1 cattle for 1 food.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain' && player.food >= 1 && player.canPlaceAnimals('cattle', 1)) {
      game.actions.offerBuyAnimal(player, this, 'cattle', 1)
    }
  },
}
