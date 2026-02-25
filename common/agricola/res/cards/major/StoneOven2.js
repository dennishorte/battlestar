module.exports = {
  id: 'stone-oven-2',
  name: 'Stone Oven',
  deck: 'major',
  type: 'major',
  cost: { clay: 2, stone: 3 },
  victoryPoints: 3,
  expansion: '5-6',
  text: [
    '"Bake Bread" action: Up to 2 times Grain \u2192 4 Food',
    'When you build this improvement, you can immediately take a "Bake Bread" action.',
  ],
  abilities: {
    canBake: true,
    bakingRate: 4,
    bakingLimit: 2,
  },
  onBuy(game, player) {
    if (player.grain >= 1) {
      game.actions.bakeBread(player)
    }
  },
}
