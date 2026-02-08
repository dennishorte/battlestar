const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bunny Breeder (E139)', () => {
  test('offers choice when played', () => {
    const card = res.getCardById('bunny-breeder-e139')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerBunnyBreederChoice = jest.fn()
    game.actions.offerBunnyBreederChoice = offerBunnyBreederChoice

    card.onPlay(game, dennis)

    expect(offerBunnyBreederChoice).toHaveBeenCalledWith(dennis, card)
  })
})
