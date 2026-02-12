const t = require('../../../testutil_v2.js')

describe('Nave', () => {
  test('scores 1 VP per column with rooms', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['nave-e032'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: 1 },
          ],
        },
      },
    })
    game.run()

    // Rooms in columns 0 and 1 → 2 VP
    t.testBoard(game, {
      dennis: {
        score: -11,
        minorImprovements: ['nave-e032'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: 1 },
          ],
        },
      },
    })
  })
})
