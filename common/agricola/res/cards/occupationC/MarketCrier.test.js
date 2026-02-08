const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Market Crier (C142)', () => {
  test('offers bonus when using take-grain action', () => {
    const card = res.getCardById('market-crier-c142')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerMarketCrierBonus: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerMarketCrierBonus).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('market-crier-c142')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerMarketCrierBonus: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerMarketCrierBonus).not.toHaveBeenCalled()
  })
})
