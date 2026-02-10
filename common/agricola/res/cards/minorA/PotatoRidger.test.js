const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Potato Ridger', () => {
  test('forces conversion when 4+ vegetables', () => {
    const card = res.getCardById('potato-ridger-a059')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['potato-ridger-a059'],
        vegetables: 4,
      },
    })
    game.run()

    const dennis = t.dennis(game)

    card.onHarvestVegetables(game, dennis)

    expect(dennis.vegetables).toBe(3)
    expect(dennis.food).toBe(6)
  })

  test('offers optional conversion with 3 vegetables', () => {
    const card = res.getCardById('potato-ridger-a059')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['potato-ridger-a059'],
        vegetables: 3,
      },
    })
    game.run()

    const dennis = t.dennis(game)

    let offerCalled = false
    game.actions.offerPotatoRidger = (player, sourceCard) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onHarvestVegetables(game, dennis)

    expect(offerCalled).toBe(true)
  })

  test('does nothing with less than 3 vegetables', () => {
    const card = res.getCardById('potato-ridger-a059')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['potato-ridger-a059'],
        vegetables: 2,
      },
    })
    game.run()

    const dennis = t.dennis(game)

    let offerCalled = false
    game.actions.offerPotatoRidger = () => {
      offerCalled = true
    }

    card.onHarvestVegetables(game, dennis)

    expect(offerCalled).toBe(false)
    expect(dennis.vegetables).toBe(2)
    expect(dennis.food).toBe(0)
  })
})
