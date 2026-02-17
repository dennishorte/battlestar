const t = require('../../../testutil_v2.js')

describe('Lumberjack', () => {
  // Card text: "Immediately place 1 wood on each of the next round spaces, up to
  // the number of fences you built. At the start of these rounds, you get the wood."

  test('onPlay with 4 fences schedules wood on next 4 rounds', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['lumberjack-b119'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],  // 4 fences
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Lumberjack')

    // Round 1 when playing; fences = 4 → schedule wood on rounds 2, 3, 4, 5
    t.testBoard(game, {
      dennis: {
        occupations: ['lumberjack-b119'],
        scheduled: { wood: { 2: 1, 3: 1, 4: 1, 5: 1 } },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('onPlay with 0 fences schedules nothing', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['lumberjack-b119'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Lumberjack')

    t.testBoard(game, {
      dennis: {
        occupations: ['lumberjack-b119'],
      },
    })
  })

  test('onPlay caps scheduling at round 14', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['lumberjack-b119'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],  // 4 fences
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Lumberjack')

    // Round 12 when playing; 4 fences → try 13, 14, 15, 16 → only 13, 14
    t.testBoard(game, {
      dennis: {
        occupations: ['lumberjack-b119'],
        scheduled: { wood: { 13: 1, 14: 1 } },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('scheduled wood is collected at start of scheduled round', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['lumberjack-b119'],
        wood: 0,
        scheduled: { wood: { 3: 1, 4: 1 } },
      },
    })
    game.run()

    // Round 3 start: scheduled wood delivered (+1)
    t.testBoard(game, {
      dennis: {
        occupations: ['lumberjack-b119'],
        wood: 1,
        scheduled: { wood: { 4: 1 } },
      },
    })
  })
})
