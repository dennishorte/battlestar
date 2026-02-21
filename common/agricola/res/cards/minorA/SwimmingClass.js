module.exports = {
  id: "swimming-class-a035",
  name: "Swimming Class",
  deck: "minorA",
  number: 35,
  type: "minor",
  cost: { food: 1 },
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "In the returning home phase of each round, if you return a person from the \"Fishing\" accumulation space, you get 2 bonus points for each newborn that you return home.",
  onReturnHome(game, player) {
    if (player.usedFishingThisRound) {
      const newborns = player.getNewbornsReturningHome()
      if (newborns > 0) {
        const points = newborns * 2
        player.addBonusPoints(points)
        game.log.add({
          template: '{player} gets {points} bonus points from {card}',
          args: { player, points , card: this},
        })
      }
    }
  },
}
