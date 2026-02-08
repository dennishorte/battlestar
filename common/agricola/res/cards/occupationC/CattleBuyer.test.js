const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cattle Buyer (C167)', () => {
  test('offers purchase when another player uses fencing action', () => {
    const card = res.getCardById('cattle-buyer-c167')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    game.actions = { offerCattleBuyerPurchase: jest.fn() }

    card.onAnyAction(game, micah, 'fencing', dennis)

    expect(game.actions.offerCattleBuyerPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger when card owner uses fencing action', () => {
    const card = res.getCardById('cattle-buyer-c167')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerCattleBuyerPurchase: jest.fn() }

    card.onAnyAction(game, dennis, 'fencing', dennis)

    expect(game.actions.offerCattleBuyerPurchase).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('cattle-buyer-c167')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    game.actions = { offerCattleBuyerPurchase: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerCattleBuyerPurchase).not.toHaveBeenCalled()
  })
})
