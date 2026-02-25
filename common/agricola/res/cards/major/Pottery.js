module.exports = {
  id: 'pottery',
  name: 'Pottery',
  deck: 'major',
  type: 'major',
  cost: { clay: 2, stone: 2 },
  victoryPoints: 2,
  text: [
    'Harvest: At most 1 time Clay \u2192 2 Food',
    'Scoring: 3/5/7 Clay \u2192 1/2/3 bonus points',
  ],
  abilities: {
    harvestConversion: {
      resource: 'clay',
      food: 2,
      limit: 1,
    },
    endGameBonus: {
      resource: 'clay',
      thresholds: [0, 0, 1, 2, 3],
      spendingCosts: [3, 5, 7],
    },
  },
}
