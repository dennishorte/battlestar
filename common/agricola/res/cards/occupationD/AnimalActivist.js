module.exports = {
  id: "animal-activist-d136",
  name: "Animal Activist",
  deck: "occupationD",
  number: 136,
  type: "occupation",
  players: "1+",
  text: "If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood. During scoring, each player with the most fenced stables gets 2 bonus points.",
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
        template: '{player} gets {amount} wood from {card}',
        args: { player, amount: wood , card: this},
      })
    }
  },
  getEndGamePointsAllPlayers(game) {
    const bonuses = {}
    let maxFencedStables = 0
    for (const player of game.players.all()) {
      maxFencedStables = Math.max(maxFencedStables, player.getFencedStableCount())
    }
    for (const player of game.players.all()) {
      if (player.getFencedStableCount() === maxFencedStables) {
        bonuses[player.name] = 2
      }
    }
    return bonuses
  },
}
