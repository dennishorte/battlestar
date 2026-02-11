const t = require('../../../testutil_v2.js')

describe("Potter's Yard", () => {
  test('gives clay when plowing a field (using a space) and offers food exchange', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['potters-yard-a040'],
        wood: 1, reed: 1, // cost to play Potter's Yard
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
          fields: [
            { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 },
          ],
        },
      },
    })
    game.run()

    // dennis: Meeting Place → play Potter's Yard (gets 1 food + becomes SP)
    // onPlay fires: places clay on unused spaces (15 - 3 rooms - 5 fields = 7 unused)
    t.choose(game, 'Meeting Place')
    t.choose(game, "Minor Improvement.Potter's Yard")

    // micah: simple action
    t.choose(game, 'Forest')

    // dennis: Farmland → plow a field (uses 1 unused space)
    // onUseSpace fires: -1 pottersYardClay, +1 clay, offer exchange
    t.choose(game, 'Farmland')
    t.action(game, 'plow-space', { row: 1, col: 3 })
    t.choose(game, 'Exchange 1 clay for 2 food')

    // micah: simple action
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 (Meeting Place) + 2 (clay→food exchange)
        minorImprovements: ['potters-yard-a040'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
          fields: [
            { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 },
            { row: 1, col: 3 },
          ],
        },
      },
    })

    // Verify pottersYardClay decremented
    const dennis = t.dennis(game)
    expect(dennis.pottersYardClay).toBe(6) // 7 - 1 = 6
  })

  test('can skip the clay-for-food exchange', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['potters-yard-a040'],
        wood: 1, reed: 1,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
          fields: [
            { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, "Minor Improvement.Potter's Yard")

    t.choose(game, 'Forest')

    t.choose(game, 'Farmland')
    t.action(game, 'plow-space', { row: 1, col: 3 })
    t.choose(game, 'Skip') // keep the clay

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 1,  // Meeting Place only
        clay: 1,  // kept the clay
        minorImprovements: ['potters-yard-a040'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
          fields: [
            { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 },
            { row: 1, col: 3 },
          ],
        },
      },
    })
  })
})
