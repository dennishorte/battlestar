module.exports = {
  id: "acorns-basket-b084",
  name: "Acorns Basket",
  deck: "minorB",
  number: 84,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { occupations: 3 },
  category: "Livestock Provider",
  text: "Place 1 wild boar on each of the next 2 round spaces. At the start of these rounds, you get the wild boar.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 2; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'boar', round, 1)
    }
    game.log.add({
      template: '{player} schedules wild boar from {card}',
      args: { player , card: this},
    })
  },
}
