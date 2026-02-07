const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Facades Carving (A036)', () => {
  test('offers exchange when player has food and harvests completed', () => {
    const card = res.getCardById('facades-carving-a036')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.getCompletedHarvestCount = () => 2

    let offerCalled = false
    game.actions.offerFacadesCarving = (player, sourceCard, maxExchange) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(maxExchange).toBe(2)
    }

    card.onPlay(game, dennis)

    expect(offerCalled).toBe(true)
  })

  test('does not offer when no harvests completed', () => {
    const card = res.getCardById('facades-carving-a036')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.getCompletedHarvestCount = () => 0

    let offerCalled = false
    game.actions.offerFacadesCarving = () => {
      offerCalled = true
    }

    card.onPlay(game, dennis)

    expect(offerCalled).toBe(false)
  })

  test('does not offer when player has no food', () => {
    const card = res.getCardById('facades-carving-a036')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getCompletedHarvestCount = () => 2

    let offerCalled = false
    game.actions.offerFacadesCarving = () => {
      offerCalled = true
    }

    card.onPlay(game, dennis)

    expect(offerCalled).toBe(false)
  })
})
