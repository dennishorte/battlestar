module.exports = {
  id: 'basketmakers-workshop-2',
  name: "Basketmaker's Workshop",
  deck: 'major',
  type: 'major',
  cost: { reed: 2, stone: 3 },
  victoryPoints: 2,
  expansion: '5-6',
  text: [
    'Harvest: At most 1 time Reed \u2192 3 Food',
    'Scoring: 2/4/5 Reed \u2192 1/2/3 bonus points',
  ],
  abilities: {
    harvestConversion: {
      resource: 'reed',
      food: 3,
      limit: 1,
    },
    endGameBonus: {
      resource: 'reed',
      thresholds: [0, 1, 2, 3],
      spendingCosts: [2, 4, 5],
    },
  },
}
