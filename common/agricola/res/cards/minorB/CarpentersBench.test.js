const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Carpenter's Bench (B015)", () => {
  test('offers pasture building when using take-wood', () => {
    const card = res.getCardById('carpenters-bench-b015')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerCarpentersBench = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerCarpentersBench).toHaveBeenCalledWith(dennis, card)
  })

  test('offers pasture building when using copse', () => {
    const card = res.getCardById('carpenters-bench-b015')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerCarpentersBench = jest.fn()

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerCarpentersBench).toHaveBeenCalledWith(dennis, card)
  })

  test('offers pasture building when using take-3-wood', () => {
    const card = res.getCardById('carpenters-bench-b015')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerCarpentersBench = jest.fn()

    card.onAction(game, dennis, 'take-3-wood')

    expect(game.actions.offerCarpentersBench).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer for non-wood actions', () => {
    const card = res.getCardById('carpenters-bench-b015')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerCarpentersBench = jest.fn()

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerCarpentersBench).not.toHaveBeenCalled()
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('carpenters-bench-b015')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
