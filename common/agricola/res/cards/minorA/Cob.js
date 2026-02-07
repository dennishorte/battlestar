module.exports = {
  id: "cob-a076",
  name: "Cob",
  deck: "minorA",
  number: 76,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "At the start of each work phase, if you have at least 1 clay in your supply, you can exchange exactly 1 grain for 2 clay and 1 food.",
  onWorkPhaseStart(game, player) {
    if (player.clay >= 1 && player.grain >= 1) {
      game.actions.offerCob(player, this)
    }
  },
}
