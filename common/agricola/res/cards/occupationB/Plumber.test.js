const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Plumber (B128)', () => {
  test('offers discounted renovation when using Major Improvement action', () => {
    const card = res.getCardById('plumber-b128')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerDiscountedRenovation: jest.fn() }

    card.onAction(game, dennis, 'major-improvement')

    expect(game.actions.offerDiscountedRenovation).toHaveBeenCalledWith(dennis, card, 2)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('plumber-b128')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerDiscountedRenovation: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerDiscountedRenovation).not.toHaveBeenCalled()
  })
})
