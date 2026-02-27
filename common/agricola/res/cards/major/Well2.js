module.exports = {
  id: 'well-2',
  name: 'Well',
  deck: 'major',
  type: 'major',
  cost: { stone: 3, clay: 1 },
  victoryPoints: 4,
  expansion: '5-6',
  baseVersions: ['well'],
  text: [
    'Place 1 food on each of the next 5 round spaces. At the start of these rounds, you get the food.',
  ],
  onBuy(game, player) {
    const currentRound = game.state.round
    for (let i = 1; i <= 5; i++) {
      game.scheduleResource(player, 'food', currentRound + i, 1)
    }
    game.log.add({
      template: '{player} places food on the next 5 round spaces',
      args: { player },
    })
  },
}
