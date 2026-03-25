module.exports = {
  id: "forest-clearer-b162",
  name: "Forest Clearer",
  deck: "occupationB",
  number: 162,
  type: "occupation",
  players: "4+",
  text: "Each time you obtain exactly 2/3/4 wood from a wood accumulation space, you get 1 additional wood and 1/0/1 food.",
  matches_onAction(game, player, actionId) {
    return game.isWoodAccumulationSpace(actionId)
  },
  onAction(game, player, actionId, resources) {
    if (resources && resources.wood) {
      if (resources.wood === 2) {
        player.addResource('wood', 1)
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 wood and 1 food',
          args: { player },
        })
      }
      else if (resources.wood === 3) {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood',
          args: { player },
        })
      }
      else if (resources.wood === 4) {
        player.addResource('wood', 1)
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 wood and 1 food',
          args: { player },
        })
      }
    }
  },
}
