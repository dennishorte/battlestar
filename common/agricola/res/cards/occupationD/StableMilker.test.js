const t = require('../../../testutil_v2.js')

describe('Stable Milker', () => {
  test('gives 1 cattle when building 2 stables on same turn', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stable-milker-d166'],
        wood: 4, // 2 stables at 2 wood each
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 2, col: 0 })
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 2, col: 1 })
    // Loop auto-exits: 0 wood remaining

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['stable-milker-d166'],
        animals: { cattle: 1 },
        farmyard: {
          stables: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('does not give cattle when building only 1 stable', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stable-milker-d166'],
        wood: 2, // only 1 stable affordable
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 2, col: 0 })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['stable-milker-d166'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
