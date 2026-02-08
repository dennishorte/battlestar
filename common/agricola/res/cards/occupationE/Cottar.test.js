const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cottar (E122)', () => {
  test('offers wood or clay when playing an improvement', () => {
    const card = res.getCardById('cottar-e122')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerWoodOrClay = jest.fn()
    game.actions.offerWoodOrClay = offerWoodOrClay

    card.onPlayImprovement(game, dennis)

    expect(offerWoodOrClay).toHaveBeenCalledWith(dennis, card)
  })

  test('offers wood or clay when building an improvement', () => {
    const card = res.getCardById('cottar-e122')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerWoodOrClay = jest.fn()
    game.actions.offerWoodOrClay = offerWoodOrClay

    card.onBuildImprovement(game, dennis)

    expect(offerWoodOrClay).toHaveBeenCalledWith(dennis, card)
  })
})
