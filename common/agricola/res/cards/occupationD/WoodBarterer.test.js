const t = require('../../../testutil_v2.js')

describe('Wood Barterer', () => {
  test('gets 2 wood before Farm Expansion', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wood-barterer-d119'],
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    // WoodBarterer triggers BEFORE the action
    t.choose(game, 'Get 2 wood')
    // Now Farm Expansion runs — with 2 wood, can build a stable
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 2, col: 0 })
    // After building stable (cost 2 wood), can't afford more
    // Loop auto-exits

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['wood-barterer-d119'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('exchanges 2 wood for 2 reed before Fencing', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wood-barterer-d119'],
        wood: 6,  // 6 - 2 (exchange) + 0 = 4 wood remaining (enough for a 1-space pasture)
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    // WoodBarterer triggers before Fencing
    t.choose(game, 'Exchange 2 wood for 2 reed')
    // Build a 1-space pasture using 4 fences (4 wood)
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // 0 wood remaining, fencing auto-exits

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['wood-barterer-d119'],
        wood: 0,   // 6 - 2(exchange) - 4(fences) = 0
        reed: 2,   // from exchange
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
  })

  test('can skip', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wood-barterer-d119'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    // WoodBarterer triggers — skip
    t.choose(game, 'Skip')
    // Farm Expansion: 2 wood only affords a stable
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 2, col: 0 })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['wood-barterer-d119'],
        wood: 0,   // 2 - 2(stable)
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger on non-build action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wood-barterer-d119'],
        wood: 5,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // not a build action — no WoodBarterer prompt

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['wood-barterer-d119'],
        wood: 5,
        food: 2,
      },
    })
  })
})
