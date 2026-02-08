const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Merchant (C096)', () => {
  test('offers repeat for major-improvement action', () => {
    const card = res.getCardById('merchant-c096')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.actions = { offerMerchantRepeat: jest.fn() }

    card.onAction(game, dennis, 'major-improvement')

    expect(game.actions.offerMerchantRepeat).toHaveBeenCalledWith(dennis, card, 'major-improvement')
  })

  test('offers repeat for minor-improvement action', () => {
    const card = res.getCardById('merchant-c096')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.actions = { offerMerchantRepeat: jest.fn() }

    card.onAction(game, dennis, 'minor-improvement')

    expect(game.actions.offerMerchantRepeat).toHaveBeenCalledWith(dennis, card, 'minor-improvement')
  })

  test('does not offer repeat when player has no food', () => {
    const card = res.getCardById('merchant-c096')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.actions = { offerMerchantRepeat: jest.fn() }

    card.onAction(game, dennis, 'major-improvement')

    expect(game.actions.offerMerchantRepeat).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('merchant-c096')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    game.actions = { offerMerchantRepeat: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerMerchantRepeat).not.toHaveBeenCalled()
  })
})
