module.exports = {
  id: "house-steward-b136",
  name: "House Steward",
  deck: "occupationB",
  number: 136,
  type: "occupation",
  players: "3+",
  text: "If there are still 1/3/6/9 complete rounds left to play, you immediately get 1/2/3/4 wood. During scoring, each player with the most rooms gets 3 bonus points.",
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
    else if (roundsLeft >= 1) {
      wood = 1
    }
    if (wood > 0) {
      player.addResource('wood', wood)
      game.log.add({
        template: '{player} gets {amount} wood from House Steward',
        args: { player, amount: wood },
      })
    }
  },
  getEndGamePointsAllPlayers(game) {
    const bonuses = {}
    let maxRooms = 0
    for (const player of game.players.all()) {
      maxRooms = Math.max(maxRooms, player.getRoomCount())
    }
    for (const player of game.players.all()) {
      if (player.getRoomCount() === maxRooms) {
        bonuses[player.name] = 3
      }
    }
    return bonuses
  },
}
