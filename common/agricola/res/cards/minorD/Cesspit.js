module.exports = {
  id: "cesspit-d040",
  name: "Cesspit",
  deck: "minorD",
  number: 40,
  type: "minor",
  cost: {},
  vps: -1,
  prereqs: { fields: 2, occupations: 1 },
  category: "Building Resource Provider",
  text: "Alternate placing 1 clay and 1 wild boar on each remaining round space, starting with clay. At the start of these rounds, you get the respective good.",
  onPlay(game, player) {
    const currentRound = game.state.round
    let isClay = true
    for (let round = currentRound + 1; round <= 14; round++) {
      if (isClay) {
        if (!game.state.scheduledClay) {
          game.state.scheduledClay = {}
        }
        if (!game.state.scheduledClay[player.name]) {
          game.state.scheduledClay[player.name] = {}
        }
        game.state.scheduledClay[player.name][round] =
            (game.state.scheduledClay[player.name][round] || 0) + 1
      }
      else {
        if (!game.state.scheduledBoar) {
          game.state.scheduledBoar = {}
        }
        if (!game.state.scheduledBoar[player.name]) {
          game.state.scheduledBoar[player.name] = {}
        }
        game.state.scheduledBoar[player.name][round] =
            (game.state.scheduledBoar[player.name][round] || 0) + 1
      }
      isClay = !isClay
    }
    game.log.add({
      template: '{player} schedules clay and wild boar from Cesspit',
      args: { player },
    })
  },
}
