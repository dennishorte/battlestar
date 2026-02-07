module.exports = {
  id: "sowing-master-d109",
  name: "Sowing Master",
  deck: "occupationD",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 wood. Each time after you use an action space with the \"Sow\" action, you get 2 food.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Sowing Master',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'plow-sow' || actionId === 'sow-bake') {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Sowing Master',
        args: { player },
      })
    }
  },
}
