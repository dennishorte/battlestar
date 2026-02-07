const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Manger (A032)', () => {
  test('gives bonus points for large pastures', () => {
    const card = res.getCardById('manger-a032')
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }] },
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }] },
          ],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    // 6 pasture spaces = 1 bonus point
    expect(card.getEndGamePoints(dennis)).toBe(1)
  })

  test('gives 4 points for 10+ spaces', () => {
    const card = res.getCardById('manger-a032')
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        farmyard: {
          pastures: [
            { spaces: [
              { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
              { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
            ] },
          ],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    expect(card.getEndGamePoints(dennis)).toBe(4)
  })
})
