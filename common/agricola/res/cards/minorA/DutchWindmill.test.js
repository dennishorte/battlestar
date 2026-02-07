const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Dutch Windmill (A063)', () => {
  test('gives 3 extra food when baking in round after harvest', () => {
    const card = res.getCardById('dutch-windmill-a063')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.lastHarvestRound = 4
    game.state.round = 5

    card.onBake(game, dennis)

    expect(dennis.food).toBe(3)
  })

  test('gives nothing in non-post-harvest round', () => {
    const card = res.getCardById('dutch-windmill-a063')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.lastHarvestRound = 4
    game.state.round = 6

    card.onBake(game, dennis)

    expect(dennis.food).toBe(0)
  })
})
