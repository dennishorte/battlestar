module.exports = {
  id: "conjurer-a155",
  name: "Conjurer",
  deck: "occupationA",
  number: 155,
  type: "occupation",
  players: "4+",
  text: "Each time you use the \"Traveling Players\" accumulation space, you get an additional 1 wood and 1 grain.",
  onAction(game, player, actionId) {
    if (actionId === 'traveling-players') {
      player.addResource('wood', 1)
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 grain from Conjurer',
        args: { player },
      })
    }
  },
}
