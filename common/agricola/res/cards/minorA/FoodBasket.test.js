const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Food Basket (A008)', () => {
  test('gives 1 grain and 1 vegetable on play', () => {
    const card = res.getCardById('food-basket-a008')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.vegetables = 0

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
    expect(dennis.vegetables).toBe(1)
  })
})
