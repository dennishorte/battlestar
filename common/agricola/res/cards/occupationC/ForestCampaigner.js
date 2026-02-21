module.exports = {
  id: "forest-campaigner-c158",
  name: "Forest Campaigner",
  deck: "occupationC",
  number: 158,
  type: "occupation",
  players: "4+",
  text: "Each time before you place a person, if there are at least 8 wood total on accumulation spaces, you get 1 food.",
  onBeforeAction(game, player) {
    let totalWood = 0
    for (const actionId of Object.keys(game.state.actionSpaces)) {
      if (game.isAccumulationSpace(actionId)) {
        const resources = game.getAccumulatedResources(actionId)
        totalWood += resources.wood || 0
      }
    }
    if (totalWood >= 8) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
