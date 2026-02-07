const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forest Plow (B017)', () => {
  test('offers plow when using take-wood with enough wood', () => {
    const card = res.getCardById('forest-plow-b017')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    game.actions.offerForestPlow = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerForestPlow).toHaveBeenCalledWith(dennis, card, 'take-wood')
  })

  test('offers plow when using copse', () => {
    const card = res.getCardById('forest-plow-b017')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 2
    game.actions.offerForestPlow = jest.fn()

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerForestPlow).toHaveBeenCalledWith(dennis, card, 'copse')
  })

  test('does not offer when not enough wood', () => {
    const card = res.getCardById('forest-plow-b017')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions.offerForestPlow = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerForestPlow).not.toHaveBeenCalled()
  })

  test('does not offer for non-wood actions', () => {
    const card = res.getCardById('forest-plow-b017')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    game.actions.offerForestPlow = jest.fn()

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerForestPlow).not.toHaveBeenCalled()
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('forest-plow-b017')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
