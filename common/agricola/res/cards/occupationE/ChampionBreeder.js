module.exports = {
  id: "champion-breeder-e133",
  name: "Champion Breeder",
  deck: "occupationE",
  number: 133,
  type: "occupation",
  players: "1+",
  text: "Each time you place 2 or 3+ newborn animals on your farm during the breeding phase of the harvest, you get 1 or 2 bonus points, respectively.",
  matches_onBreedingPhaseEnd(_game, _player, newbornCount) {
    return newbornCount >= 2
  },
  onBreedingPhaseEnd(game, player, newbornCount) {
    const points = newbornCount >= 3 ? 2 : 1
    player.addBonusPoints(points)
    game.log.add({
      template: '{player} gets {amount} bonus points',
      args: { player, amount: points },
    })
  },
}
