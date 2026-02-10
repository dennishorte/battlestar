const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Manger', () => {
  test('gives bonus points for large pastures', () => {
    const card = res.getCardById('manger-a032')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }] },
            { spaces: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }] },
          ],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    // 6 pasture spaces = 1 bonus point
    expect(card.getEndGamePoints(dennis)).toBe(1)
  })

  test('gives 4 points for 10+ spaces', () => {
    const card = res.getCardById('manger-a032')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        farmyard: {
          pastures: [
            { spaces: [
              { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
              { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
              { row: 2, col: 0 }, { row: 2, col: 1 },
            ] },
          ],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    expect(card.getEndGamePoints(dennis)).toBe(4)
  })
})
