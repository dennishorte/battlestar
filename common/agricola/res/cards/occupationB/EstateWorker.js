module.exports = {
  id: "estate-worker-b125",
  name: "Estate Worker",
  deck: "occupationB",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "Place 1 wood, 1 clay, 1 reed, and 1 stone in this order on the next 4 round spaces. At the start of these rounds, you get the respective building resource.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const resources = ['wood', 'clay', 'reed', 'stone']
    for (let i = 0; i < 4; i++) {
      const round = currentRound + 1 + i
      if (round <= 14) {
        const res = resources[i]
        const key = `scheduled${res.charAt(0).toUpperCase() + res.slice(1)}`
        if (!game.state[key]) {
          game.state[key] = {}
        }
        if (!game.state[key][player.name]) {
          game.state[key][player.name] = {}
        }
        game.state[key][player.name][round] =
            (game.state[key][player.name][round] || 0) + 1
      }
    }
    game.log.add({
      template: '{player} schedules building resources from Estate Worker',
      args: { player },
    })
  },
}
