const t = require('../../../testutil_v2.js')

describe('Stockman', () => {
  test('gives 1 cattle when building 2nd stable', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stockman-d168'],
        wood: 2, // 1 stable at 2 wood
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Build 2nd stable via Farm Expansion (costs 2 wood, auto-exits after)
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 2, col: 1 })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['stockman-d168'],
        animals: { cattle: 1 },
        farmyard: {
          stables: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('gives 1 boar when building 3rd stable', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stockman-d168'],
        wood: 2,
        farmyard: {
          stables: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 0, col: 4 })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['stockman-d168'],
        animals: { boar: 1 },
        farmyard: {
          stables: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 0, col: 4 }],
        },
      },
    })
  })

  test('does not trigger on 1st stable', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stockman-d168'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 2, col: 0 })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['stockman-d168'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
