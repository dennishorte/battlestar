module.exports = {
  id: "writing-desk-d028",
  name: "Writing Desk",
  deck: "minorD",
  number: 28,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  category: "Actions Booster",
  text: "Each time you use a \"Lessons\" action space, you can play 1 additional occupation for an occupation cost of 2 food.",
  onAction(game, player, actionId) {
    if (actionId === 'lessons-1' || actionId === 'lessons-2') {
      game.actions.offerOccupationForFood(player, this, 2)
    }
  },
}
