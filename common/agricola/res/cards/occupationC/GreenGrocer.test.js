const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Green Grocer (C103)', () => {
  test('offers exchange at round start', () => {
    const card = res.getCardById('green-grocer-c103')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerGreenGrocerExchange: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerGreenGrocerExchange).toHaveBeenCalledWith(dennis, card)
  })
})
