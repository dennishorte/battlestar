module.exports = {
  id: "tree-cutter-d143",
  name: "Tree Cutter",
  deck: "occupationD",
  number: 143,
  type: "occupation",
  players: "1+",
  text: "Each time you use an accumulation space providing at least 3 goods of the same type except wood, you get an additional 1 wood. (Food is also considered a good.)",
  onAction(game, player, actionId) {
    if (game.isAccumulationSpace(actionId)) {
      const resources = game.getAccumulatedResources(actionId)
      for (const [resource, amount] of Object.entries(resources)) {
        if (resource !== 'wood' && amount >= 3) {
          player.addResource('wood', 1)
          game.log.add({
            template: '{player} gets 1 wood from Tree Cutter',
            args: { player },
          })
          break
        }
      }
    }
  },
}
