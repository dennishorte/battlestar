module.exports = {
  id: "animal-husbandry-worker-e136",
  name: "Animal Husbandry Worker",
  deck: "occupationE",
  number: 136,
  type: "occupation",
  players: "1+",
  text: "If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood and a \"Build Fences\" action. During scoring, each player with the most pastures gets 2 bonus points.",
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
        template: '{player} gets {amount} wood from Animal Husbandry Worker',
        args: { player, amount: wood },
      })
      game.actions.offerBuildFences(player, this)
    }
  },
  getEndGamePointsAllPlayers(game) {
    const bonuses = {}
    let maxPastures = 0
    for (const player of game.players.all()) {
      maxPastures = Math.max(maxPastures, player.getPastureCount())
    }
    for (const player of game.players.all()) {
      if (player.getPastureCount() === maxPastures) {
        bonuses[player.name] = 2
      }
    }
    return bonuses
  },
}
