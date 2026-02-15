const t = require('../../../testutil_v2.js')

describe('Groom', () => {
  test('onPlay gives 1 wood', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: { hand: ['groom-b089'] },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Groom')

    t.testBoard(game, {
      dennis: {
        occupations: ['groom-b089'],
        wood: 1,
      },
    })
  })

  test('onRoundStart in stone house with wood offers to build stable for 1 wood', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['groom-b089'],
        roomType: 'stone',
        wood: 2,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Build stable at 2,1')

    t.testBoard(game, {
      dennis: {
        occupations: ['groom-b089'],
        roomType: 'stone',
        wood: 1,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
          stables: [{ row: 2, col: 1 }],
        },
      },
    })
  })
})
