module.exports = {
  id: "stone-cart-c079",
  name: "Stone Cart",
  deck: "minorC",
  number: 79,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 2 },
  category: "Building Resource Provider",
  text: "Place 1 stone on each remaining even-numbered round space. At the start of these rounds, you get the stone.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let round = 2; round <= 14; round += 2) {
      if (round > currentRound) {
        if (!game.state.scheduledStone) {
          game.state.scheduledStone = {}
        }
        if (!game.state.scheduledStone[player.name]) {
          game.state.scheduledStone[player.name] = {}
        }
        game.state.scheduledStone[player.name][round] =
            (game.state.scheduledStone[player.name][round] || 0) + 1
      }
    }
    game.log.add({
      template: '{player} schedules stone from Stone Cart',
      args: { player },
    })
  },
}
