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
  harvestConversion: {
    resource: 'clay',
    food: 2,
    limit: 1,
  },
  endGameExchange: {
    resource: 'clay',
    tiers: [
      { cost: 3, vp: 1 },
      { cost: 5, vp: 2 },
      { cost: 7, vp: 3 },
    ],
  },
}
