const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Handcart (B081)', () => {
  test('offers taking resource at work phase start', () => {
    const card = res.getCardById('handcart-b081')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerHandcart = jest.fn()

    card.onWorkPhaseStart(game, dennis)

    expect(game.actions.offerHandcart).toHaveBeenCalledWith(dennis, card)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('handcart-b081')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
