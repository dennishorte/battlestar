const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tasting (B063)', () => {
  test('offers exchange when using lessons with grain', () => {
    const card = res.getCardById('tasting-b063')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1
    game.actions.offerTasting = jest.fn()

    card.onLessons(game, dennis)

    expect(game.actions.offerTasting).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when no grain', () => {
    const card = res.getCardById('tasting-b063')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.actions.offerTasting = jest.fn()

    card.onLessons(game, dennis)

    expect(game.actions.offerTasting).not.toHaveBeenCalled()
  })

  test('has 1 VP', () => {
    const card = res.getCardById('tasting-b063')
    expect(card.vps).toBe(1)
  })

  test('costs 2 wood', () => {
    const card = res.getCardById('tasting-b063')
    expect(card.cost).toEqual({ wood: 2 })
  })
})
