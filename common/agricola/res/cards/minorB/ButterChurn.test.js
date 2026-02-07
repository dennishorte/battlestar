const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Butter Churn (B050)', () => {
  test('gives food based on sheep and cattle during harvest', () => {
    const card = res.getCardById('butter-churn-b050')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = (type) => {
      if (type === 'sheep') {
        return 6
      }
      if (type === 'cattle') {
        return 4
      }
      return 0
    }
    dennis.food = 0

    card.onHarvest(game, dennis)

    // floor(6/3) + floor(4/2) = 2 + 2 = 4
    expect(dennis.food).toBe(4)
  })
})
