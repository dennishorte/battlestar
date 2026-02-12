const t = require('../../../testutil_v2.js')

describe('Civic Facade', () => {
  test('gives 1 food at round start if more occupations than improvements in hand', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['civic-facade-d048'],
        hand: ['test-occupation-1', 'test-occupation-2', 'test-minor-1'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // 2 occupations > 1 improvement in hand → +1 food
    t.testBoard(game, {
      dennis: {
        food: 1,
        hand: ['test-occupation-1', 'test-occupation-2', 'test-minor-1'],
        minorImprovements: ['civic-facade-d048'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not give food if equal occupations and improvements in hand', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['civic-facade-d048'],
        hand: ['test-occupation-1', 'test-minor-1'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // 1 occupation = 1 improvement → no food
    t.testBoard(game, {
      dennis: {
        food: 0,
        hand: ['test-occupation-1', 'test-minor-1'],
        minorImprovements: ['civic-facade-d048'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
