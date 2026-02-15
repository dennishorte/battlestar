module.exports = {
  id: "ranch-provost-c136",
  name: "Ranch Provost",
  deck: "occupationC",
  number: 136,
  type: "occupation",
  players: "3+",
  text: "If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood. During scoring, each player with a pasture of highest capacity gets 3 bonus points.",
  onPlay(game, player) {
    const roundsLeft = 14 - game.state.round
    let wood = 0
    if (roundsLeft >= 9) {
      wood = 4
    }
    else if (roundsLeft >= 6) {
      wood = 3
    }
    else if (roundsLeft >= 3) {
      wood = 2
    }
    if (wood > 0) {
      player.addResource('wood', wood)
      game.log.add({
        template: '{player} gets {amount} wood from Ranch Provost',
        args: { player, amount: wood },
      })
    }
  },
  getEndGamePointsAllPlayers(game) {
    const bonuses = {}
    let maxCapacity = 0
    for (const player of game.players.all()) {
      const pastures = player.getPastures ? player.getPastures() : []
      for (const p of pastures) {
        const cap = p.spaces ? p.spaces.length * 2 : 0
        if (cap > maxCapacity) {
          maxCapacity = cap
        }
      }
    }
    if (maxCapacity > 0) {
      for (const player of game.players.all()) {
        const pastures = player.getPastures ? player.getPastures() : []
        for (const p of pastures) {
          const cap = p.spaces ? p.spaces.length * 2 : 0
          if (cap === maxCapacity) {
            bonuses[player.name] = 3
            break
          }
        }
      }
    }
    return bonuses
  },
}
