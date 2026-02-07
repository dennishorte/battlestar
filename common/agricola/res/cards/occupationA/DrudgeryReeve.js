module.exports = {
  id: "drudgery-reeve-a136",
  name: "Drudgery Reeve",
  deck: "occupationA",
  number: 136,
  type: "occupation",
  players: "3+",
  text: "If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood. During scoring, each player with 1+/2+/3+ building resources of each type gets 1/3/5 bonus points.",
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
        template: '{player} gets {amount} wood from Drudgery Reeve',
        args: { player, amount: wood },
      })
    }
  },
  getEndGamePointsAllPlayers(game) {
    const bonuses = {}
    for (const player of game.players.all()) {
      const minResources = Math.min(player.wood, player.clay, player.reed, player.stone)
      if (minResources >= 3) {
        bonuses[player.name] = 5
      }
      else if (minResources >= 2) {
        bonuses[player.name] = 3
      }
      else if (minResources >= 1) {
        bonuses[player.name] = 1
      }
    }
    return bonuses
  },
}
