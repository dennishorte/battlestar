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
}
