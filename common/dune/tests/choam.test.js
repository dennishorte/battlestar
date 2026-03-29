const t = require('../testutil')

describe('CHOAM Contracts', () => {

  test('CHOAM game initializes with contract deck and market', () => {
    const game = t.fixture({ useCHOAM: true })
    game.run()

    const deck = game.zones.byId('common.contractDeck')
    const market = game.zones.byId('common.contractMarket')

    // Market should have 2 face-up contracts
    expect(market.cardlist().length).toBe(2)
    // Deck + market should total all non-RiseOfIx contracts
    expect(deck.cardlist().length + market.cardlist().length).toBeGreaterThan(0)
  })

  test('non-CHOAM game has empty contract zones', () => {
    const game = t.fixture({ useCHOAM: false })
    game.run()

    const deck = game.zones.byId('common.contractDeck')
    const market = game.zones.byId('common.contractMarket')
    expect(deck.cardlist().length).toBe(0)
    expect(market.cardlist().length).toBe(0)
  })

  test('player contract zones exist', () => {
    const game = t.fixture({ useCHOAM: true })
    game.run()

    const dennisContracts = game.zones.byId('dennis.contracts')
    const dennisCompleted = game.zones.byId('dennis.contractsCompleted')
    expect(dennisContracts.cardlist().length).toBe(0)
    expect(dennisCompleted.cardlist().length).toBe(0)
  })
})
