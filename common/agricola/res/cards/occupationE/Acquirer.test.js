const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Acquirer (E102)', () => {
  test('offers purchase when player has enough food', () => {
    const card = res.getCardById('acquirer-e102')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getFamilySize = () => 3
    dennis.food = 5

    const offerAcquirerPurchase = jest.fn()
    game.actions.offerAcquirerPurchase = offerAcquirerPurchase

    card.onRoundStart(game, dennis)

    expect(offerAcquirerPurchase).toHaveBeenCalledWith(dennis, card, 3)
  })

  test('does not offer purchase when player has insufficient food', () => {
    const card = res.getCardById('acquirer-e102')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getFamilySize = () => 3
    dennis.food = 2

    const offerAcquirerPurchase = jest.fn()
    game.actions.offerAcquirerPurchase = offerAcquirerPurchase

    card.onRoundStart(game, dennis)

    expect(offerAcquirerPurchase).not.toHaveBeenCalled()
  })
})
