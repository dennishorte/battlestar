module.exports = {
  id: "baking-sheet-a030",
  name: "Baking Sheet",
  deck: "minorA",
  number: 30,
  type: "minor",
  cost: {},
  prereqs: { noGrainFields: true },
  category: "Food Provider",
  text: "Each time you take a \"Bake Bread\" action, you can use this card to exchange exactly 1 grain for 2 food and 1 bonus point.",
  onBake(game, player) {
    if (player.grain >= 1) {
      game.actions.offerBakingSheet(player, this)
    }
  },
}
