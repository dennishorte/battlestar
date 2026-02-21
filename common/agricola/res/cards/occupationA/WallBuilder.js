module.exports = {
  id: "wall-builder-a111",
  name: "Wall Builder",
  deck: "occupationA",
  number: 111,
  type: "occupation",
  players: "1+",
  text: "Each time you build at least 1 room, you can place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.",
  onBuildRoom(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 4; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'food', round, 1)
    }
    game.log.add({
      template: '{player} places food on the next 4 round spaces from {card}',
      args: { player , card: this},
    })
  },
}
