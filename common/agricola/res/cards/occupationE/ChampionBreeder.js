module.exports = {
  id: "champion-breeder-e133",
  name: "Champion Breeder",
  deck: "occupationE",
  number: 133,
  type: "occupation",
  players: "1+",
  text: "Each time you place 2 or 3+ newborn animals on your farm during the breeding phase of the harvest, you get 1 or 2 bonus points, respectively.",
  onBreedingPhaseEnd(game, player, newbornCount) {
    let points = 0
    if (newbornCount >= 3) {
      points = 2
    }
    else if (newbornCount >= 2) {
      points = 1
    }
    if (points > 0) {
      player.addBonusPoints(points)
      game.log.add({
        template: '{player} gets {amount} bonus points from Champion Breeder',
        args: { player, amount: points },
      })
    }
  },
}
