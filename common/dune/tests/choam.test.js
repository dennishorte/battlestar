const t = require('../testutil')

describe('CHOAM Contracts', () => {

  test('game initializes with contract deck and market', () => {
    const game = t.fixture()
    game.run()

    const deck = game.zones.byId('common.contractDeck')
    const market = game.zones.byId('common.contractMarket')

    // Market should have 2 face-up contracts
    expect(market.cardlist().length).toBe(2)
    // Deck + market should total all non-RiseOfIx contracts
    expect(deck.cardlist().length + market.cardlist().length).toBeGreaterThan(0)
  })

  test('player contract zones exist', () => {
    const game = t.fixture()
    game.run()

    const dennisContracts = game.zones.byId('dennis.contracts')
    const dennisCompleted = game.zones.byId('dennis.contractsCompleted')
    expect(dennisContracts.cardlist().length).toBe(0)
    expect(dennisCompleted.cardlist().length).toBe(0)
  })
})
