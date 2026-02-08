const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Prophet (E094)', () => {
  test('offers renovation and build fences on play', () => {
    const card = res.getCardById('prophet-e094')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerRenovation = jest.fn()
    const offerBuildFences = jest.fn()
    game.actions.offerRenovation = offerRenovation
    game.actions.offerBuildFences = offerBuildFences

    card.onPlay(game, dennis)

    expect(offerRenovation).toHaveBeenCalledWith(dennis, card)
    expect(offerBuildFences).toHaveBeenCalledWith(dennis, card)
  })
})
