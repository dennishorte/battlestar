module.exports = {
  id: "farmyard-manure-a043",
  name: "Farmyard Manure",
  deck: "minorA",
  number: 43,
  type: "minor",
  cost: {},
  prereqs: { animals: 1 },
  category: "Food Provider",
  text: "Each time you build 1 or more stables in one turn, you place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.",
  onBuildStable(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 3; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'food', round, 1)
    }
    game.log.add({
      template: '{player} places food on the next 3 round spaces from Farmyard Manure',
      args: { player },
    })
  },
}
