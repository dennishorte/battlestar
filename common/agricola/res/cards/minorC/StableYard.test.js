const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stable Yard (C050)', () => {
  test('gives food based on rounds left', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        hand: ['stable-yard-c050'],
        farmyard: {
          stables: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
          pastures: [
            { spaces: [{ row: 1, col: 0 }] },
            { spaces: [{ row: 1, col: 1 }] },
            { spaces: [{ row: 1, col: 2 }] },
          ],
        },
      },
      round: 10,
    })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.round = 10

    const card = res.getCardById('stable-yard-c050')
    card.onPlay(game, dennis)

    // 14 - 10 = 4 rounds left
    expect(dennis.food).toBe(4)
  })
})
