module.exports = {
  id: "interior-decorator-d111",
  name: "Interior Decorator",
  deck: "occupationD",
  number: 111,
  type: "occupation",
  players: "1+",
  text: "Each time you renovate, place 1 food on each of the next 6 round spaces. At the start of these rounds, you get the food.",
  onRenovate(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 6; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'food', round, 1)
    }
    game.log.add({
      template: '{player} schedules 1 food for next 6 rounds from Interior Decorator',
      args: { player },
    })
  },
}
