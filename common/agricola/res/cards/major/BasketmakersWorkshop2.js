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
  harvestConversion: {
    resource: 'reed',
    food: 3,
    limit: 1,
  },
  getEndGamePoints(player) {
    const count = player.reed || 0
    if (count >= 5) {
      return 3
    }
    if (count >= 4) {
      return 2
    }
    if (count >= 2) {
      return 1
    }
    return 0
  },
}
