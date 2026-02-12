const t = require('../../../testutil_v2.js')

describe('Land Register', () => {
  test('scores 2 VP when no unused spaces', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['land-register-e034'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: 1,
        minorImprovements: ['land-register-e034'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
          ],
        },
      },
    })
  })

  test('scores 0 VP when there are unused spaces', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['land-register-e034'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -14,
        minorImprovements: ['land-register-e034'],
      },
    })
  })
})
