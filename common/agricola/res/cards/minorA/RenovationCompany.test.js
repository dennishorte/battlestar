const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Renovation Company (A013)', () => {
  test('gives 3 clay and offers free renovation on play', () => {
    const card = res.getCardById('renovation-company-a013')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    let offerCalled = false
    game.actions.offerFreeRenovation = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(3)
    expect(offerCalled).toBe(true)
  })
})
