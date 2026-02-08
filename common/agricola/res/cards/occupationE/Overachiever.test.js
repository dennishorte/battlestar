const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Overachiever (E130)', () => {
  test('offers improvement when using family growth action', () => {
    const card = res.getCardById('overachiever-e130')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerOverachieverImprovement = jest.fn()
    game.actions.offerOverachieverImprovement = offerOverachieverImprovement

    card.onAction(game, dennis, 'family-growth')

    expect(offerOverachieverImprovement).toHaveBeenCalledWith(dennis, card)
  })

  test('offers improvement when using family growth urgent action', () => {
    const card = res.getCardById('overachiever-e130')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerOverachieverImprovement = jest.fn()
    game.actions.offerOverachieverImprovement = offerOverachieverImprovement

    card.onAction(game, dennis, 'family-growth-urgent')

    expect(offerOverachieverImprovement).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer improvement for other actions', () => {
    const card = res.getCardById('overachiever-e130')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerOverachieverImprovement = jest.fn()
    game.actions.offerOverachieverImprovement = offerOverachieverImprovement

    card.onAction(game, dennis, 'forest')

    expect(offerOverachieverImprovement).not.toHaveBeenCalled()
  })
})
