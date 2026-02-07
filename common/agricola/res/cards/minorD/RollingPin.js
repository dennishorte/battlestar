module.exports = {
  id: "rolling-pin-d052",
  name: "Rolling Pin",
  deck: "minorD",
  number: 52,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 1 },
  category: "Food Provider",
  text: "In the returning home phase of each round, if you have more clay than wood in your supply, you get 1 food.",
  onReturnHome(game, player) {
    if (player.clay > player.wood) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Rolling Pin',
        args: { player },
      })
    }
  },
}
