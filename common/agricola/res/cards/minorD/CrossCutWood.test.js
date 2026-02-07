const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cross-Cut Wood (D004)', () => {
  test('gives wood equal to stone in supply', () => {
    const card = res.getCardById('cross-cut-wood-d004')
    const game = t.fixture({ cardSets: ['minorD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 4
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(4)
  })
})
