module.exports = {
  id: "forest-campaigner-c158",
  name: "Forest Campaigner",
  deck: "occupationC",
  number: 158,
  type: "occupation",
  players: "4+",
  text: "Each time before you place a person, if there are at least 8 wood total on accumulation spaces, you get 1 food.",
  matches_onBeforeAction(game, _player, _actionId) {
    let totalWood = 0
    for (const actionId of Object.keys(game.state.actionSpaces)) {
      if (game.isAccumulationSpace(actionId)) {
        const resources = game.getAccumulatedResources(actionId)
        totalWood += resources.wood || 0
      }
    }
    return totalWood >= 8
  },
  onBeforeAction(_game, player, _actionId) {
    player.addResource('food', 1)
  },
}
