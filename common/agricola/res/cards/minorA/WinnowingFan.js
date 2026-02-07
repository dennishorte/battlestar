module.exports = {
  id: "winnowing-fan-a061",
  name: "Winnowing Fan",
  deck: "minorA",
  number: 61,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { bakingImprovement: true },
  category: "Food Provider",
  text: "After the field phase of each harvest, you can use a baking improvement but only to turn exactly 1 grain into food. (This is not considered a \"Bake Bread\" action.)",
  onFieldPhaseEnd(game, player) {
    if (player.grain >= 1 && player.hasBakingImprovement()) {
      game.actions.offerWinnowingFan(player, this)
    }
  },
}
