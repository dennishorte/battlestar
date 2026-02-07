const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wood Cart (C076)', () => {
  test('gives +2 wood on wood accumulation actions', () => {
    const card = res.getCardById('wood-cart-c076')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(7)
  })
})
