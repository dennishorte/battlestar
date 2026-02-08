const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Renovation Preparer (OccD 123)', () => {
  test('gives 2 clay when building a wood room', () => {
    const card = res.getCardById('renovation-preparer-d123')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onBuildRoom(game, dennis, 'wood')

    expect(dennis.clay).toBe(2)
  })

  test('gives 2 stone when building a clay room', () => {
    const card = res.getCardById('renovation-preparer-d123')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onBuildRoom(game, dennis, 'clay')

    expect(dennis.stone).toBe(2)
  })

  test('does not give resources when building a stone room', () => {
    const card = res.getCardById('renovation-preparer-d123')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.stone = 0

    card.onBuildRoom(game, dennis, 'stone')

    expect(dennis.clay).toBe(0)
    expect(dennis.stone).toBe(0)
  })
})
