const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Oven Site (A027)', () => {
  test('gives 2 wood and offers discounted oven on play', () => {
    const card = res.getCardById('oven-site-a027')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    let offerCalled = false
    game.actions.offerDiscountedOven = (player, sourceCard, cost) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(cost).toEqual({ clay: 1, stone: 1 })
    }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
    expect(offerCalled).toBe(true)
  })
})
