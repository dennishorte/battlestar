module.exports = {
  id: "tree-cutter-d143",
  name: "Tree Cutter",
  deck: "occupationD",
  number: 143,
  type: "occupation",
  players: "1+",
  text: "Each time you use an accumulation space providing at least 3 goods of the same type except wood, you get an additional 1 wood. (Food is also considered a good.)",
  matches_onAction(game, player, actionId) {
    return game.isAccumulationSpace(actionId)
  },
  onAction(game, player, actionId) {
    const resources = game.getAccumulatedResources(actionId)
    for (const [resource, amount] of Object.entries(resources)) {
      if (resource !== 'wood' && amount >= 3) {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood',
          args: { player },
        })
        break
      }
    }
  },
}
