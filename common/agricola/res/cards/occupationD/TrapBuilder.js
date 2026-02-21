module.exports = {
  id: "trap-builder-d147",
  name: "Trap Builder",
  deck: "occupationD",
  number: 147,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Day Laborer\" action space, place 1 food, 1 food, and 1 wild boar on the next 3 round spaces, respectively. At the start of these rounds, you get the good.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      const currentRound = game.state.round
      const goods = ['food', 'food', 'boar']
      for (let i = 0; i < 3; i++) {
        const round = currentRound + i + 1
        const good = goods[i]
        game.scheduleResource(player, good, round, 1)
      }
      game.log.add({
        template: '{player} schedules 1 food, 1 food, 1 wild boar from {card}',
        args: { player , card: this},
      })
    }
  },
}
