const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Livestock Expert (E138)', () => {
  test('offers choice when played in round 11 or before', () => {
    const card = res.getCardById('livestock-expert-e138')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 10

    const dennis = t.player(game)

    const offerLivestockExpertChoice = jest.fn()
    game.actions.offerLivestockExpertChoice = offerLivestockExpertChoice

    card.onPlay(game, dennis)

    expect(offerLivestockExpertChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer choice when played after round 11', () => {
    const card = res.getCardById('livestock-expert-e138')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 12

    const dennis = t.player(game)

    const offerLivestockExpertChoice = jest.fn()
    game.actions.offerLivestockExpertChoice = offerLivestockExpertChoice

    card.onPlay(game, dennis)

    expect(offerLivestockExpertChoice).not.toHaveBeenCalled()
  })
})
