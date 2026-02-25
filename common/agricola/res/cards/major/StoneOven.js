module.exports = {
  id: 'stone-oven',
  name: 'Stone Oven',
  deck: 'major',
  type: 'major',
  cost: { clay: 1, stone: 3 },
  victoryPoints: 3,
  text: [
    '"Bake Bread" action: Up to 2 times Grain \u2192 4 Food',
    'When you build this improvement, you can immediately take a "Bake Bread" action.',
  ],
  bakingConversion: { from: 'grain', to: 'food', rate: 4, limit: 2 },
  onBuy(game, player) {
    if (player.grain >= 1) {
      game.actions.bakeBread(player)
    }
  },
}
