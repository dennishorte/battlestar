module.exports = {
  id: "handplow-a019",
  name: "Handplow",
  deck: "minorA",
  number: 19,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Add 5 to the current round and place 1 field tile on the corresponding round space. At the start of that round, you can plow the field.",
  onPlay(game, player) {
    const targetRound = game.state.round + 5
    if (targetRound <= 14) {
      if (!game.state.scheduledPlows) {
        game.state.scheduledPlows = {}
      }
      if (!game.state.scheduledPlows[player.name]) {
        game.state.scheduledPlows[player.name] = []
      }
      game.state.scheduledPlows[player.name].push(targetRound)
      game.log.add({
        template: '{player} schedules a field to plow in round {round}',
        args: { player, round: targetRound },
      })
    }
  },
}
