module.exports = {
  id: "legworker-c117",
  name: "Legworker",
  deck: "occupationC",
  number: 117,
  type: "occupation",
  players: "1+",
  text: "Each time you use an action space that is orthogonally adjacent to another action space occupied by one of your people, you get 1 wood.",
  onAction(game, player, actionId) {
    if (game.isAdjacentToOwnWorker(player, actionId)) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Legworker',
        args: { player },
      })
    }
  },
}
