module.exports = {
  id: "private-teacher-c131",
  name: "Private Teacher",
  deck: "occupationC",
  number: 131,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Grain Seeds\" action space when any \"Lessons\" action space is occupied, you can also play an occupation for an occupation cost of 1 food.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain' && (game.isActionOccupied('lessons-1') || game.isActionOccupied('lessons-2'))) {
      game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
    }
  },
}
