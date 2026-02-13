const t = require('../../../testutil_v2.js')

describe('Cubbyhole', () => {
  test('stores 1 food when building a single room', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cubbyhole-e052'],
        wood: 5, reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Loop auto-exits: 0 wood + 0 reed remaining

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        minorImprovements: ['cubbyhole-e052'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }],
        },
      },
    })

    // Verify card state: 1 room built → 1 food stored
    const stored = game.cardState('cubbyhole-e052').stored
    expect(stored).toBe(1)
  })

  test('stores food equal to room count in multi-room build', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cubbyhole-e052'],
        wood: 10, reed: 4, // 2 rooms
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Build Room')
    t.choose(game, '1,1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        minorImprovements: ['cubbyhole-e052'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
        },
      },
    })

    const stored = game.cardState('cubbyhole-e052').stored
    expect(stored).toBe(2)
  })

  test('gives stored food at start of feeding phase', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 4, // first harvest
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cubbyhole-e052'],
        wood: 5, reed: 2, // enough for 1 room
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Build 1 room → Cubbyhole stores 1 food
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.choose(game, 'Grain Seeds')    // micah
    t.choose(game, 'Day Laborer')    // dennis
    t.choose(game, 'Clay Pit')       // micah

    // Harvest → Feeding: Cubbyhole gives 1 stored food
    t.testBoard(game, {
      dennis: {
        // 10 + 2 (Day Laborer) + 1 (Cubbyhole) - 4 (feed 2 workers) = 9
        food: 9,
        minorImprovements: ['cubbyhole-e052'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }],
        },
      },
    })
  })
})
