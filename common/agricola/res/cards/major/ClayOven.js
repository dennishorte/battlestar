module.exports = {
  id: 'clay-oven',
  name: 'Clay Oven',
  deck: 'major',
  type: 'major',
  cost: { clay: 3, stone: 1 },
  victoryPoints: 2,
  text: [
    '"Bake Bread" action: At most 1 time Grain \u2192 5 Food',
    'When you build this improvement, you can immediately take a "Bake Bread" action.',
  ],
  abilities: {
    canBake: true,
    bakingRate: 5,
    bakingLimit: 1,
  },
  onBuy(game, player) {
    if (player.grain >= 1) {
      game.actions.bakeBread(player)
    }
  },
}
