module.exports = {
  id: 'joinery-2',
  name: 'Joinery',
  deck: 'major',
  type: 'major',
  cost: { wood: 2, stone: 3 },
  victoryPoints: 2,
  expansion: '5-6',
  text: [
    'Harvest: At most 1 time Wood \u2192 2 Food',
    'Scoring: 3/5/7 Wood \u2192 1/2/3 bonus points',
  ],
  abilities: {
    harvestConversion: {
      resource: 'wood',
      food: 2,
      limit: 1,
    },
    endGameBonus: {
      resource: 'wood',
      thresholds: [0, 0, 1, 2, 3],
      spendingCosts: [3, 5, 7],
    },
  },
}
