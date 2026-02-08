const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Beneficiary (E097)', () => {
  test('offers occupation and minor improvement when this is 3rd occupation', () => {
    const card = res.getCardById('beneficiary-e097')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 3

    const offerPlayOccupation = jest.fn()
    const offerPlayMinorImprovement = jest.fn()
    game.actions.offerPlayOccupation = offerPlayOccupation
    game.actions.offerPlayMinorImprovement = offerPlayMinorImprovement

    card.onPlay(game, dennis)

    expect(offerPlayOccupation).toHaveBeenCalledWith(dennis, card, { cost: { food: 1 } })
    expect(offerPlayMinorImprovement).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer anything when this is not 3rd occupation', () => {
    const card = res.getCardById('beneficiary-e097')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 2

    const offerPlayOccupation = jest.fn()
    const offerPlayMinorImprovement = jest.fn()
    game.actions.offerPlayOccupation = offerPlayOccupation
    game.actions.offerPlayMinorImprovement = offerPlayMinorImprovement

    card.onPlay(game, dennis)

    expect(offerPlayOccupation).not.toHaveBeenCalled()
    expect(offerPlayMinorImprovement).not.toHaveBeenCalled()
  })
})
