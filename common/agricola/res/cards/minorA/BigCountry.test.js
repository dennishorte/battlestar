const t = require('../../../testutil_v2.js')

describe('Big Country', () => {
  test('gives bonus points and food based on rounds left', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['big-country-a033'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
          ],
        },
      },
      round: 11,
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Big Country')

    // Round 11: roundsLeft = 14 - 11 = 3, so 3 bonus points and 6 food
    t.testBoard(game, {
      dennis: {
        food: 7, // +1 Meeting Place + 6 from Big Country
        bonusPoints: 3,
        hand: [],
        minorImprovements: ['big-country-a033'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
          ],
        },
      },
    })
  })
})
