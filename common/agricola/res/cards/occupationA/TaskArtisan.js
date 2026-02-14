module.exports = {
  id: "task-artisan-a096",
  name: "Task Artisan",
  deck: "occupationA",
  number: 96,
  type: "occupation",
  players: "1+",
  text: "When you play this card and each time a stone accumulation space appears on a round space in the preparation phase, you get 1 wood and a \"Minor Improvement\" action.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Task Artisan',
      args: { player },
    })
    game.actions.buyMinorImprovement(player)
  },
  onStoneActionRevealed(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Task Artisan',
      args: { player },
    })
    game.actions.buyMinorImprovement(player)
  },
}
