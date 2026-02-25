module.exports = {
  id: 'pottery-2',
  name: 'Pottery',
  deck: 'major',
  type: 'major',
  cost: { clay: 2, stone: 3 },
  victoryPoints: 2,
  expansion: '5-6',
  text: [
    'Harvest: At most 1 time Clay \u2192 2 Food',
    'Scoring: 3/5/7 Clay \u2192 1/2/3 bonus points',
  ],
  harvestConversion: {
    resource: 'clay',
    food: 2,
    limit: 1,
  },
  getEndGamePoints(player) {
    const count = player.clay || 0
    if (count >= 7) {
      return 3
    }
    if (count >= 5) {
      return 2
    }
    if (count >= 3) {
      return 1
    }
    return 0
  },
}
