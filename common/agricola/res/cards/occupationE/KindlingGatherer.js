module.exports = {
  id: "kindling-gatherer-e118",
  name: "Kindling Gatherer",
  deck: "occupationE",
  number: 118,
  type: "occupation",
  players: "1+",
  text: "Each time you get food from an action space, you get 1 additional wood.",
  onAction(game, player, actionId) {
    if (game.actionSpaceGivesFood(actionId)) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from {card}',
        args: { player , card: this},
      })
    }
  },
}
