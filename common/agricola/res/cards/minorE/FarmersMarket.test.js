const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Farmers Market (E008)', () => {
  test('gives 1 vegetable', () => {
    const card = res.getCardById('farmers-market-e008')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onPlay(game, dennis)

    expect(dennis.vegetables).toBe(1)
  })
})
