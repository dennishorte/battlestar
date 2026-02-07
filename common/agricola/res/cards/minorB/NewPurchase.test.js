const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('New Purchase (B070)', () => {
  test('offers purchase on harvest round start with enough food', () => {
    const card = res.getCardById('new-purchase-b070')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 4
    game.isHarvestRound = jest.fn().mockReturnValue(true)
    game.actions.offerNewPurchase = jest.fn()

    card.onRoundStart(game, dennis, 4)

    expect(game.actions.offerNewPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer on non-harvest rounds', () => {
    const card = res.getCardById('new-purchase-b070')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 4
    game.isHarvestRound = jest.fn().mockReturnValue(false)
    game.actions.offerNewPurchase = jest.fn()

    card.onRoundStart(game, dennis, 3)

    expect(game.actions.offerNewPurchase).not.toHaveBeenCalled()
  })

  test('does not offer without enough food', () => {
    const card = res.getCardById('new-purchase-b070')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.isHarvestRound = jest.fn().mockReturnValue(true)
    game.actions.offerNewPurchase = jest.fn()

    card.onRoundStart(game, dennis, 4)

    expect(game.actions.offerNewPurchase).not.toHaveBeenCalled()
  })

  test('has no cost', () => {
    const card = res.getCardById('new-purchase-b070')
    expect(card.cost).toEqual({})
  })
})
