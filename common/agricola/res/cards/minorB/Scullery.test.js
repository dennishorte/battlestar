const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Scullery (B057)', () => {
  test('gives 1 food at round start in wooden house', () => {
    const card = res.getCardById('scullery-b057')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'wood'
    dennis.food = 0

    card.onRoundStart(game, dennis)

    expect(dennis.food).toBe(1)
  })

  test('gives nothing in clay house', () => {
    const card = res.getCardById('scullery-b057')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.food = 0

    card.onRoundStart(game, dennis)

    expect(dennis.food).toBe(0)
  })
})
