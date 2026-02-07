const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bookcase (C068)', () => {
  test('gives 1 vegetable after playing occupation', () => {
    const card = res.getCardById('bookcase-c068')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onPlayOccupation(game, dennis)

    expect(dennis.vegetables).toBe(1)
  })
})
