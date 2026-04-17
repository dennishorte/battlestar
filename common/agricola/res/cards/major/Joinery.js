module.exports = {
  id: 'joinery',
  name: 'Joinery',
  deck: 'major',
  type: 'major',
  cost: { wood: 2, stone: 2 },
  victoryPoints: 2,
  text: [
    'Harvest: At most 1 time Wood \u2192 2 Food',
    'Scoring: 3/5/7 Wood \u2192 1/2/3 bonus points',
  ],
  harvestConversion: {
    resource: 'wood',
    food: 2,
    limit: 1,
  },
  endGameExchange: {
    resource: 'wood',
    tiers: [
      { cost: 3, vp: 1 },
      { cost: 5, vp: 2 },
      { cost: 7, vp: 3 },
    ],
  },
}
