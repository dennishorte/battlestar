const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bargain Hunter (E152)', () => {
  test('offers minor improvement when player has food', () => {
    const card = res.getCardById('bargain-hunter-e152')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3

    const offerBargainHunterMinor = jest.fn()
    game.actions.offerBargainHunterMinor = offerBargainHunterMinor

    card.onRoundStart(game, dennis)

    expect(offerBargainHunterMinor).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer minor improvement when player has no food', () => {
    const card = res.getCardById('bargain-hunter-e152')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    const offerBargainHunterMinor = jest.fn()
    game.actions.offerBargainHunterMinor = offerBargainHunterMinor

    card.onRoundStart(game, dennis)

    expect(offerBargainHunterMinor).not.toHaveBeenCalled()
  })
})
