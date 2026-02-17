module.exports = {
  id: "big-country-a033",
  name: "Big Country",
  deck: "minorA",
  number: 33,
  type: "minor",
  cost: {},
  prereqs: { allFarmyardUsed: true },
  category: "Points Provider",
  text: "For each complete round left to play, you immediately get 1 bonus point and 2 food.",
  onPlay(game, player) {
    const roundsLeft = 14 - game.state.round
    if (roundsLeft > 0) {
      player.addBonusPoints(roundsLeft)
      player.addResource('food', roundsLeft * 2)
      game.log.add({
        template: '{player} gets {points} bonus points and {food} food from Big Country',
        args: { player, points: roundsLeft, food: roundsLeft * 2 },
      })
    }
  },
}
