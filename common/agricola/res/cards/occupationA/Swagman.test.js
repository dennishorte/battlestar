const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Swagman (OccA 129)', () => {
  test('offers grain seeds space when using farm expansion', () => {
    const card = res.getCardById('swagman-a129')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'farm-expansion')

    expect(game.actions.offerUseOtherSpace).toHaveBeenCalledWith(
      dennis, card, 'take-grain', { allowOccupied: true }
    )
  })

  test('offers farm expansion when using grain seeds', () => {
    const card = res.getCardById('swagman-a129')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerUseOtherSpace).toHaveBeenCalledWith(
      dennis, card, 'farm-expansion', { allowOccupied: true }
    )
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('swagman-a129')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerUseOtherSpace).not.toHaveBeenCalled()
  })
})
