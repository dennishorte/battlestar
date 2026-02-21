module.exports = {
  id: "clay-deliveryman-d120",
  name: "Clay Deliveryman",
  deck: "occupationD",
  number: 120,
  type: "occupation",
  players: "1+",
  text: "Place 1 clay on each remaining space for rounds 6 to 14. At the start of these rounds, you get the clay.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let round = Math.max(6, currentRound + 1); round <= 14; round++) {
      game.scheduleResource(player, 'clay', round, 1)
    }
    game.log.add({
      template: '{player} schedules clay for rounds 6-14 from {card}',
      args: { player , card: this},
    })
  },
}
