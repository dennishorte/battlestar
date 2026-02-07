module.exports = {
  id: "night-school-student-a152",
  name: "Night-School Student",
  deck: "occupationA",
  number: 152,
  type: "occupation",
  players: "3+",
  text: "Each returning home phase in which no player returns a person from a \"Lessons\" action space, you can play an occupation for an occupation cost of 1 food.",
  onReturnHome(game, player) {
    if (!game.anyPlayerReturnedFromLessons()) {
      game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
    }
  },
}
