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
  getEndGamePoints(player) {
    const count = player.wood || 0
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
