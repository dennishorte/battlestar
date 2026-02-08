const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Canvas Sack (C040)', () => {
  test('gives 1 vegetable when paid with grain', () => {
    const card = res.getCardById('canvas-sack-c040')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onPlay(game, dennis, 'grain')

    expect(dennis.vegetables).toBe(1)
  })

  test('gives 4 wood when paid with reed', () => {
    const card = res.getCardById('canvas-sack-c040')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis, 'reed')

    expect(dennis.wood).toBe(4)
  })

  test('gives nothing when paid with other resources', () => {
    const card = res.getCardById('canvas-sack-c040')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.wood = 0

    card.onPlay(game, dennis, 'food')

    expect(dennis.vegetables).toBe(0)
    expect(dennis.wood).toBe(0)
  })
})
