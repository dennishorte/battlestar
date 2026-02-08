const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stock Protector (B094)', () => {
  test('gives 2 wood before using Fencing action', () => {
    const card = res.getCardById('stock-protector-b094')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onBeforeAction(game, dennis, 'fencing')

    expect(dennis.wood).toBe(2)
  })

  test('does not give wood for other actions', () => {
    const card = res.getCardById('stock-protector-b094')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onBeforeAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(0)
  })

  test('offers extra person after using Fencing action', () => {
    const card = res.getCardById('stock-protector-b094')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerExtraPerson: jest.fn() }

    card.onAction(game, dennis, 'fencing')

    expect(game.actions.offerExtraPerson).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer extra person for other actions', () => {
    const card = res.getCardById('stock-protector-b094')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerExtraPerson: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerExtraPerson).not.toHaveBeenCalled()
  })
})
