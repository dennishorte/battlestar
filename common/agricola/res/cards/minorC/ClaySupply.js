module.exports = {
  id: "clay-supply-c077",
  name: "Clay Supply",
  deck: "minorC",
  number: 77,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "Place 1 clay on each of the next 3 round spaces. At the start of these rounds, you get the clay.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 3; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'clay', round, 1)
    }
    game.log.add({
      template: '{player} schedules clay from Clay Supply',
      args: { player },
    })
  },
}
