module.exports = {
  id: "newly-plowed-field-c017",
  name: "Newly-Plowed Field",
  deck: "minorC",
  number: 17,
  type: "minor",
  cost: {},
  prereqs: { fieldsExactly: 3 },
  category: "Farm Planner",
  text: "When you play this card, you can immediately plow 1 field, which needs not be adjacent to another field.",
  onPlay(game, player) {
    game.actions.plowField(player, { allowNonAdjacent: true })
  },
}
