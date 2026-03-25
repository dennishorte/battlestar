module.exports = {
  id: "conjurer-a155",
  name: "Conjurer",
  deck: "occupationA",
  number: 155,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Traveling Players\" accumulation space, you get an additional 1 wood and 1 grain.",
  matches_onAction(game, player, actionId) {
    return actionId === 'traveling-players' || actionId === 'traveling-players-5'
  },
  onAction(game, player, _actionId) {
    player.addResource('wood', 1)
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 wood and 1 grain',
      args: { player },
    })
  },
}
