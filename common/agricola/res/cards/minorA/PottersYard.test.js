const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe("Potter's Yard", () => {
  test('places clay on unused spaces on play', () => {
    const card = res.getCardById('potters-yard-a040')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['potters-yard-a040'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.getUnusedFarmyardSpaceCount = () => 5

    card.onPlay(game, dennis)

    expect(dennis.pottersYardClay).toBe(5)
  })

  test('gives clay and offers exchange when using a space', () => {
    const card = res.getCardById('potters-yard-a040')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['potters-yard-a040'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.pottersYardClay = 3

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
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['potters-yard-a040'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.pottersYardClay = 0

    let offerCalled = false
    game.actions.offerClayForFood = () => {
      offerCalled = true
    }

    card.onUseSpace(game, dennis)

    expect(dennis.clay).toBe(0)
    expect(offerCalled).toBe(false)
  })
})
