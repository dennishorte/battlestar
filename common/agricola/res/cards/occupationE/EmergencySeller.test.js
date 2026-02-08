const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Emergency Seller (E106)', () => {
  test('offers conversion based on family size', () => {
    const card = res.getCardById('emergency-seller-e106')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getFamilySize = () => 4

    const offerEmergencySellerConversion = jest.fn()
    game.actions.offerEmergencySellerConversion = offerEmergencySellerConversion

    card.onPlay(game, dennis)

    expect(offerEmergencySellerConversion).toHaveBeenCalledWith(dennis, card, 4)
  })
})
