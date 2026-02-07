module.exports = {
  id: "teachers-desk-c028",
  name: "Teacher's Desk",
  deck: "minorC",
  number: 28,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 1 },
  category: "Actions Booster",
  text: "Each time you use the \"Major Improvement\" or \"House Redevelopment\" action space, you can also play 1 occupation at an occupation cost of 1 food.",
  onAction(game, player, actionId) {
    if (actionId === 'major-improvement' || actionId === 'house-redevelopment') {
      game.actions.offerOccupationForFood(player, this, 1)
    }
  },
}
