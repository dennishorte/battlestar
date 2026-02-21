module.exports = {
  id: "brick-hammer-d080",
  name: "Brick Hammer",
  deck: "minorD",
  number: 80,
  type: "minor",
  cost: { wood: 1 },
  costAlternative: { food: 1 },
  category: "Building Resource Provider",
  text: "Each time after you build an improvement costing at least 2 clay, you get 1 stone.",
  onBuildImprovement(game, player, cost) {
    if (cost && cost.clay >= 2) {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from {card}',
        args: { player , card: this},
      })
    }
  },
}
