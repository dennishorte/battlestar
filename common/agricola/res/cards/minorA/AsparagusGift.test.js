const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Asparagus Gift (A068)', () => {
  test('gives vegetable when fences built >= current round', () => {
    const card = res.getCardById('asparagus-gift-a068')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 3
    dennis.vegetables = 0

    card.onBuildFences(game, dennis, 3)

    expect(dennis.vegetables).toBe(1)
  })

  test('gives vegetable when fences built > current round', () => {
    const card = res.getCardById('asparagus-gift-a068')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 2
    dennis.vegetables = 0

    card.onBuildFences(game, dennis, 5)

    expect(dennis.vegetables).toBe(1)
  })

  test('does not give vegetable when fences built < current round', () => {
    const card = res.getCardById('asparagus-gift-a068')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5
    dennis.vegetables = 0

    card.onBuildFences(game, dennis, 3)

    expect(dennis.vegetables).toBe(0)
  })
})
