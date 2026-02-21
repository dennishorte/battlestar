module.exports = {
  id: "loudmouth-d140",
  name: "Loudmouth",
  deck: "occupationD",
  number: 140,
  type: "occupation",
  players: "1+",
  text: "Each time you take at least 4 building resources or 4 animals from an accumulation space, you also get 1 food.",
  onAction(game, player, actionId) {
    if (game.isAccumulationSpace(actionId)) {
      const resources = game.getAccumulatedResources(actionId)
      const buildingTotal = (resources.wood || 0) + (resources.clay || 0) + (resources.reed || 0) + (resources.stone || 0)
      const animalTotal = (resources.sheep || 0) + (resources.boar || 0) + (resources.cattle || 0)
      if (buildingTotal >= 4 || animalTotal >= 4) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
