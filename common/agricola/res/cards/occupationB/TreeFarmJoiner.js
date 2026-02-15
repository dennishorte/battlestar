module.exports = {
  id: "tree-farm-joiner-b096",
  name: "Tree Farm Joiner",
  deck: "occupationB",
  number: 96,
  type: "occupation",
  players: "1+",
  text: "Place 1 wood on each of the next 2 odd-numbered round spaces. At the start of these rounds, you get the wood and, immediately afterward, a \"Minor Improvement\" action.",
  onPlay(game, player) {
    const currentRound = game.state.round
    let count = 0
    for (let round = currentRound + 1; round <= 14 && count < 2; round++) {
      if (round % 2 === 1) {
        game.scheduleEvent(player, 'woodWithMinor', round)
        count++
      }
    }
    game.log.add({
      template: '{player} schedules wood and minor improvements from Tree Farm Joiner',
      args: { player },
    })
  },
  onRoundStart(game, player) {
    const scheduled = game.state.scheduledWoodWithMinor?.[player.name] || []
    const round = game.state.round
    if (!scheduled.includes(round)) {
      return
    }
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} receives 1 scheduled wood from Tree Farm Joiner',
      args: { player },
    })
    game.state.scheduledWoodWithMinor[player.name] =
      game.state.scheduledWoodWithMinor[player.name].filter(r => r !== round)
    game.actions.buyMinorImprovement(player)
  },
}
