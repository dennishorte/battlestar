module.exports = {
  id: "dwelling-plan-d002",
  name: "Dwelling Plan",
  deck: "minorD",
  number: 2,
  type: "minor",
  cost: { food: 1 },
  category: "Farm Planner",
  text: "You can immediately take a \"Renovation\" action.",
  onPlay(game, player) {
    game.actions.offerRenovation(player, this)
  },
}
