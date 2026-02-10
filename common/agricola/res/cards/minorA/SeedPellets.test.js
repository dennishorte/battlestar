const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Seed Pellets', () => {
  test('gives 1 grain on unconditional sow', () => {
    const card = res.getCardById('seed-pellets-a065')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['seed-pellets-a065'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onSow(game, dennis, true)

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain on conditional sow', () => {
    const card = res.getCardById('seed-pellets-a065')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['seed-pellets-a065'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onSow(game, dennis, false)

    expect(dennis.grain).toBe(0)
  })
})
