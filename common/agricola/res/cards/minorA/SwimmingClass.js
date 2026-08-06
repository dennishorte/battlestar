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
  matches_onReturnHome(_game, player) {
    return !!(player.usedFishingThisRound && player.getNewbornsReturningHome() > 0)
  },
  onReturnHome(game, player) {
    const newborns = player.getNewbornsReturningHome()
    const points = newborns * 2
    player.addBonusPoints(points)
    game.log.add({
      template: '{player} gets {points} bonus points from {card}',
      args: { player, points , card: this},
    })
  },
}
