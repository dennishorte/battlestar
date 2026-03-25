module.exports = {
  id: "greengrocer-b142",
  name: "Greengrocer",
  deck: "occupationB",
  number: 142,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Grain Seeds\" action space, you also get 1 vegetable.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain'
  },
  onAction(game, player, _actionId) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable',
      args: { player },
    })
  },
}
