module.exports = {
  id: "night-school-student-a152",
  name: "Night-School Student",
  deck: "occupationA",
  number: 152,
  type: "occupation",
  players: "4+",
  text: "Each returning home phase in which no player returns a person from a \"Lessons\" action space, you can play an occupation for an occupation cost of 1 food.",
  matches_onReturnHome(game, _player) {
    return !game.anyPlayerReturnedFromLessons()
  },
  onReturnHome(game, player) {
    game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
  },
}
