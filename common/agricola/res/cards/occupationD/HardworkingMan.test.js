const t = require('../../../testutil_v2.js')

describe('Hardworking Man', () => {
  test('provides combined actions when opponent has more rooms', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['hardworking-man-d127'],
        clay: 2, // for Fireplace
      },
      micah: {
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms total (default 2 + this one)
        },
      },
    })
    game.run()

    // dennis: Hardworking Man action space (combo: +2 food, build room, major improvement)
    t.choose(game, 'Hardworking Man (gap)')
    // buildRoomAndOrStable: no wood/reed so can't build → auto-skips
    // buyImprovement: choose Fireplace (2 clay)
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    // micah: Day Laborer
    t.choose(game, 'Day Laborer')
    // dennis: Grain Seeds (+1 grain)
    t.choose(game, 'Grain Seeds')
    // micah: Forest
    t.choose(game, 'Forest')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['hardworking-man-d127'],
        food: 2,  // from Day Laborer effect on the action space
        clay: 0,  // 2 - 2 for Fireplace
        grain: 1, // from Grain Seeds
        majorImprovements: ['fireplace-2'],
      },
      micah: {
        food: 2,  // from Day Laborer
        wood: 3,  // from Forest
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('not available when opponent has same room count', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['hardworking-man-d127'],
      },
    })
    game.run()

    // Both players have 2 rooms (default). Condition fails: micah 2 rooms = dennis 2 rooms (not MORE).
    // The Hardworking Man action space should NOT appear.
    // Play a normal round.
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['hardworking-man-d127'],
        food: 2,  // from Day Laborer
        grain: 1, // from Grain Seeds
      },
    })
  })
})
