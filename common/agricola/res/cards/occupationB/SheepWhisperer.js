module.exports = {
  id: "sheep-whisperer-b164",
  name: "Sheep Whisperer",
  deck: "occupationB",
  number: 164,
  type: "occupation",
  players: "4+",
  text: "Add 2, 5, 8, and 10 to the current round and place 1 sheep on each corresponding round space. At the start of these rounds, you get the sheep.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [2, 5, 8, 10]) {
      const round = currentRound + offset
      if (round <= 14) {
        if (!game.state.scheduledSheep) {
          game.state.scheduledSheep = {}
        }
        if (!game.state.scheduledSheep[player.name]) {
          game.state.scheduledSheep[player.name] = {}
        }
        game.state.scheduledSheep[player.name][round] =
            (game.state.scheduledSheep[player.name][round] || 0) + 1
      }
    }
    game.log.add({
      template: '{player} schedules sheep from Sheep Whisperer',
      args: { player },
    })
  },
}
