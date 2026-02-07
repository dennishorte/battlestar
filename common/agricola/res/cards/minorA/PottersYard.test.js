const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Potter's Yard (A040)", () => {
  test('places clay on unused spaces on play', () => {
    const card = res.getCardById('potters-yard-a040')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getUnusedFarmyardSpaceCount = () => 5

    card.onPlay(game, dennis)

    expect(dennis.pottersYardClay).toBe(5)
  })

  test('gives clay and offers exchange when using a space', () => {
    const card = res.getCardById('potters-yard-a040')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.pottersYardClay = 3
    dennis.clay = 0

    let offerCalled = false
    game.actions.offerClayForFood = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onUseSpace(game, dennis)

    expect(dennis.pottersYardClay).toBe(2)
    expect(dennis.clay).toBe(1)
    expect(offerCalled).toBe(true)
  })

  test('does nothing when no clay left', () => {
    const card = res.getCardById('potters-yard-a040')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.pottersYardClay = 0
    dennis.clay = 0

    let offerCalled = false
    game.actions.offerClayForFood = () => {
      offerCalled = true
    }

    card.onUseSpace(game, dennis)

    expect(dennis.clay).toBe(0)
    expect(offerCalled).toBe(false)
  })
})
