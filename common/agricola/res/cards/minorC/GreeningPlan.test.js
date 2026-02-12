const t = require('../../../testutil_v2.js')

describe('Greening Plan', () => {
  test('scores 1 VP for 2 empty fields', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['greening-plan-c033'],
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -9,
        minorImprovements: ['greening-plan-c033'],
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('scores 5 VP for 6 empty fields', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['greening-plan-c033'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 1, col: 4 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: 2,
        minorImprovements: ['greening-plan-c033'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 1, col: 4 },
          ],
        },
      },
    })
  })

  test('scores 0 VP for fewer than 2 empty fields', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['greening-plan-c033'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -13,
        minorImprovements: ['greening-plan-c033'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
    })
  })
})
