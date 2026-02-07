module.exports = {
  id: "social-benefits-d076",
  name: "Social Benefits",
  deck: "minorD",
  number: 76,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { occupationsAtMost: 1 },
  category: "Building Resource Provider",
  text: "Immediately after the feeding phase of each harvest, if you have no food left, you get 1 wood and 1 clay.",
  onFeedingPhaseEnd(game, player) {
    if (player.food === 0) {
      player.addResource('wood', 1)
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 clay from Social Benefits',
        args: { player },
      })
    }
  },
}
