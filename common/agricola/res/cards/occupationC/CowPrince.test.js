const t = require('../../../testutil_v2.js')

describe('Cow Prince', () => {
  // Card text: "During scoring, you get 1 BP for each space in your farmyard
  // (including rooms) holding at least 1 cattle."

  test('scores 2 BP for cattle in 2 pasture spaces', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['cow-prince-c134'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], cattle: 2 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['cow-prince-c134'],
        animals: { cattle: 2 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], cattle: 2 },
          ],
        },
      },
    })
  })

  test('scores 0 BP with no cattle', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['cow-prince-c134'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -14,
        occupations: ['cow-prince-c134'],
      },
    })
  })
})
