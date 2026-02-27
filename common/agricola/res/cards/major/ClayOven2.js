module.exports = {
  id: 'clay-oven-2',
  name: 'Clay Oven',
  deck: 'major',
  type: 'major',
  cost: { clay: 4, stone: 1 },
  victoryPoints: 2,
  expansion: '5-6',
  baseVersions: ['clay-oven'],
  text: [
    '"Bake Bread" action: At most 1 time Grain \u2192 5 Food',
    'When you build this improvement, you can immediately take a "Bake Bread" action.',
  ],
  bakingConversion: { from: 'grain', to: 'food', rate: 5, limit: 1 },
  onBuy(game, player) {
    if (player.grain >= 1) {
      game.actions.bakeBread(player)
    }
  },
}
