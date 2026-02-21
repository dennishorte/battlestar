module.exports = {
  id: "royal-wood-d074",
  name: "Royal Wood",
  deck: "minorD",
  number: 74,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "At the end of each turn in which you use the \"Farm Expansion\" action space or build an improvement, you get 1 wood back for every 2 wood paid during those actions (rounded down).",
  onBuildImprovement(game, player, cost) {
    const woodBack = Math.floor((cost.wood || 0) / 2)
    if (woodBack > 0) {
      player.addResource('wood', woodBack)
      game.log.add({
        template: '{player} gets {amount} wood back from {card}',
        args: { player, amount: woodBack , card: this},
      })
    }
  },
  onFarmExpansion(game, player, woodPaid) {
    const woodBack = Math.floor(woodPaid / 2)
    if (woodBack > 0) {
      player.addResource('wood', woodBack)
      game.log.add({
        template: '{player} gets {amount} wood back from {card}',
        args: { player, amount: woodBack , card: this},
      })
    }
  },
}
