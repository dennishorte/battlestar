const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Baseboards', () => {
  test('gives wood for rooms and bonus if rooms > people', () => {
    const card = res.getCardById('baseboards-a004')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['baseboards-a004'],
        farmyard: { rooms: [{ row: 2, col: 0 }] }, // 3 total
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onPlay(game, dennis)

    // 3 rooms, 2 people -> 3 + 1 = 4 wood
    t.testBoard(game, {
      dennis: {
        wood: 4,
        minorImprovements: ['baseboards-a004'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
