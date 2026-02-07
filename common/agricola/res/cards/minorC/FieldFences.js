module.exports = {
  id: "field-fences-c016",
  name: "Field Fences",
  deck: "minorC",
  number: 16,
  type: "minor",
  cost: { food: 2 },
  category: "Farm Planner",
  text: "You can immediately take a \"Build Fences\" action, during which you do not have to pay wood for fences that you build next to field tiles.",
  onPlay(game, player) {
    game.actions.fieldFencesAction(player, this)
  },
}
