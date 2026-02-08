const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Buyer (OccA 156)', () => {
  test('offers purchase when another player takes reed', () => {
    const card = res.getCardById('buyer-a156')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 1
    game.actions = { offerBuyerPurchase: jest.fn() }

    card.onAnyAction(game, micah, 'take-reed', dennis)

    expect(game.actions.offerBuyerPurchase).toHaveBeenCalledWith(dennis, micah, card, 'reed')
  })

  test('offers purchase when another player takes stone', () => {
    const card = res.getCardById('buyer-a156')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 1
    game.actions = { offerBuyerPurchase: jest.fn() }

    card.onAnyAction(game, micah, 'take-stone-1', dennis)

    expect(game.actions.offerBuyerPurchase).toHaveBeenCalledWith(dennis, micah, card, 'stone')
  })

  test('offers purchase when another player takes sheep', () => {
    const card = res.getCardById('buyer-a156')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 1
    game.actions = { offerBuyerPurchase: jest.fn() }

    card.onAnyAction(game, micah, 'take-sheep', dennis)

    expect(game.actions.offerBuyerPurchase).toHaveBeenCalledWith(dennis, micah, card, 'sheep')
  })

  test('offers purchase when another player takes boar', () => {
    const card = res.getCardById('buyer-a156')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 1
    game.actions = { offerBuyerPurchase: jest.fn() }

    card.onAnyAction(game, micah, 'take-boar', dennis)

    expect(game.actions.offerBuyerPurchase).toHaveBeenCalledWith(dennis, micah, card, 'boar')
  })

  test('does not trigger when card owner uses the space', () => {
    const card = res.getCardById('buyer-a156')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerBuyerPurchase: jest.fn() }

    card.onAnyAction(game, dennis, 'take-reed', dennis)

    expect(game.actions.offerBuyerPurchase).not.toHaveBeenCalled()
  })

  test('does not trigger without food', () => {
    const card = res.getCardById('buyer-a156')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 0
    game.actions = { offerBuyerPurchase: jest.fn() }

    card.onAnyAction(game, micah, 'take-reed', dennis)

    expect(game.actions.offerBuyerPurchase).not.toHaveBeenCalled()
  })
})
