const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forest Trader (OccD 125)', () => {
  test('offers purchase when using take-wood', () => {
    const card = res.getCardById('forest-trader-d125')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerForestTraderPurchase: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerForestTraderPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('offers purchase when using copse', () => {
    const card = res.getCardById('forest-trader-d125')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerForestTraderPurchase: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerForestTraderPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('offers purchase when using take-clay', () => {
    const card = res.getCardById('forest-trader-d125')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerForestTraderPurchase: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerForestTraderPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('offers purchase when using take-clay-2', () => {
    const card = res.getCardById('forest-trader-d125')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerForestTraderPurchase: jest.fn() }

    card.onAction(game, dennis, 'take-clay-2')

    expect(game.actions.offerForestTraderPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer purchase for other actions', () => {
    const card = res.getCardById('forest-trader-d125')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerForestTraderPurchase: jest.fn() }

    card.onAction(game, dennis, 'take-stone-1')

    expect(game.actions.offerForestTraderPurchase).not.toHaveBeenCalled()
  })
})
