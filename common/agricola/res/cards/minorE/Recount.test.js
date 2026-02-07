const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Recount (E006)', () => {
  test('gives resources for those with 4+ in supply', () => {
    const card = res.getCardById('recount-e006')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    dennis.clay = 4
    dennis.stone = 3
    dennis.reed = 4

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(6) // Had 5, got 1
    expect(dennis.clay).toBe(5) // Had 4, got 1
    expect(dennis.stone).toBe(3) // Had 3, no bonus
    expect(dennis.reed).toBe(5) // Had 4, got 1
  })
})
