module.exports = {
  id: "clay-hut-builder-a120",
  name: "Clay Hut Builder",
  deck: "occupationA",
  number: 120,
  type: "occupation",
  players: "1+",
  text: "Once you no longer live in a wooden house, place 2 clay on each of the next 5 round spaces. At the start of these rounds, you get the clay.",
  onRenovate(game, player, fromType, _toType) {
    if (fromType === 'wood') {
      const currentRound = game.state.round
      for (let i = 1; i <= 5; i++) {
        const round = currentRound + i
        game.scheduleResource(player, 'clay', round, 2)
      }
      game.log.add({
        template: '{player} schedules clay from {card}',
        args: { player , card: this},
      })
    }
  },
}
