module.exports = {
  id: "kindling-gatherer-e118",
  name: "Kindling Gatherer",
  deck: "occupationE",
  number: 118,
  type: "occupation",
  players: "1+",
  text: "Each time you get food from an action space, you get 1 additional wood.",
  matches_onAction(game, player, actionId) {
    return game.actionSpaceGivesFood(actionId)
  },
  onAction(game, player, _actionId) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood',
      args: { player },
    })
  },
}
