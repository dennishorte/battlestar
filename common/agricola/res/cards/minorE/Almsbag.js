module.exports = {
  id: "almsbag-e065",
  name: "Almsbag",
  deck: "minorE",
  number: 65,
  type: "minor",
  cost: {},
  prereqs: { noOccupations: true },
  text: "When you play this card, you immediately get 1 grain for every 2 completed rounds.",
  onPlay(game, player) {
    const completedRounds = game.state.round - 1
    const grain = Math.floor(completedRounds / 2)
    if (grain > 0) {
      player.addResource('grain', grain)
      game.log.add({
        template: '{player} gets {amount} grain from Almsbag',
        args: { player, amount: grain },
      })
    }
  },
}
