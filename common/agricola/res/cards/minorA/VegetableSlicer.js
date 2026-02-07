module.exports = {
  id: "vegetable-slicer-a041",
  name: "Vegetable Slicer",
  deck: "minorA",
  number: 41,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "Each time you upgrade a Fireplace to a Cooking Hearth, you immediately get 2 wood and 1 vegetable (not retroactively).",
  onUpgradeFireplace(game, player) {
    player.addResource('wood', 2)
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 2 wood and 1 vegetable from Vegetable Slicer',
      args: { player },
    })
  },
}
