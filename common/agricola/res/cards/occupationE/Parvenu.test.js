const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Parvenu (E145)', () => {
  test('offers choice when played in round 7 or before', () => {
    const card = res.getCardById('parvenu-e145')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)

    const offerParvenuChoice = jest.fn()
    game.actions.offerParvenuChoice = offerParvenuChoice

    card.onPlay(game, dennis)

    expect(offerParvenuChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer choice when played after round 7', () => {
    const card = res.getCardById('parvenu-e145')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 8

    const dennis = t.player(game)

    const offerParvenuChoice = jest.fn()
    game.actions.offerParvenuChoice = offerParvenuChoice

    card.onPlay(game, dennis)

    expect(offerParvenuChoice).not.toHaveBeenCalled()
  })
})
