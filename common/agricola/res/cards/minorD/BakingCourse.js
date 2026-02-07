module.exports = {
  id: "baking-course-d064",
  name: "Baking Course",
  deck: "minorD",
  number: 64,
  type: "minor",
  cost: {},
  prereqs: { occupations: 1 },
  category: "Food Provider",
  text: "At the end of each round that does not end with a harvest, you can take a \"Bake Bread\" action. Whenever you bake bread, you may convert: Grain → 2 Food.",
  bakingConversion: { from: "grain", to: "food", rate: 2 },
  onRoundEnd(game, player, round) {
    if (!game.isHarvestRound(round)) {
      game.actions.bakeBread(player)
    }
  },
}
