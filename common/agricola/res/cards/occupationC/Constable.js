module.exports = {
  id: "constable-c135",
  name: "Constable",
  deck: "occupationC",
  number: 135,
  type: "occupation",
  players: "3+",
  text: "If there are still 1/3/6/9 complete rounds left to play, you immediately get 1/2/3/4 wood. During scoring, each player with no negative points gets 3 bonus points.",
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
        template: '{player} gets {amount} wood from {card}',
        args: { player, amount: wood , card: this},
      })
    }
  },
  getEndGamePointsAllPlayers(game) {
    const bonuses = {}
    for (const player of game.players.all()) {
      // No negative points means score >= 0 for all categories
      const score = player.getScore ? player.getScore() : 0
      if (score >= 0) {
        bonuses[player.name] = 3
      }
    }
    return bonuses
  },
}
