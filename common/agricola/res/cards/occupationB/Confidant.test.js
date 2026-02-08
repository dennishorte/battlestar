const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Confidant (B093)', () => {
  test('offers Confidant setup on play', () => {
    const card = res.getCardById('confidant-b093')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerConfidantSetup: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerConfidantSetup).toHaveBeenCalledWith(dennis, card)
  })
})
