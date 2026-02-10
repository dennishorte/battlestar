module.exports = {
  id: "wood-collector-c118",
  name: "Wood Collector",
  deck: "occupationC",
  number: 118,
  type: "occupation",
  players: "1+",
  text: "Place 1 wood on each of the next 5 round spaces. At the start of these rounds, you get the wood.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 5; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'wood', round, 1)
    }
    game.log.add({
      template: '{player} schedules 1 wood for next 5 rounds from Wood Collector',
      args: { player },
    })
  },
}
