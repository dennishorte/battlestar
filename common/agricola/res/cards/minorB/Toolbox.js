module.exports = {
  id: "toolbox-b027",
  name: "Toolbox",
  deck: "minorB",
  number: 27,
  type: "minor",
  cost: { wood: 1 },
  category: "Actions Booster",
  text: "In the work phase, after each turn in which you build at least 1 room, stable or fence, you can build the \"Joinery\", \"Pottery\", or \"Basketmaker's Workshop\" major improvement.",
  onBuildRoom(game, player) {
    game.actions.offerToolboxMajor(player, this)
  },
  onBuildStable(game, player) {
    game.actions.offerToolboxMajor(player, this)
  },
  onBuildFences(game, player) {
    game.actions.offerToolboxMajor(player, this)
  },
}
