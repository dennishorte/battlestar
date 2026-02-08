const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Basket Carrier (C105)', () => {
  test('offers purchase when player has at least 2 food during harvest', () => {
    const card = res.getCardById('basket-carrier-c105')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.actions = { offerBasketCarrierPurchase: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerBasketCarrierPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer purchase when player has less than 2 food', () => {
    const card = res.getCardById('basket-carrier-c105')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerBasketCarrierPurchase: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerBasketCarrierPurchase).not.toHaveBeenCalled()
  })
})
