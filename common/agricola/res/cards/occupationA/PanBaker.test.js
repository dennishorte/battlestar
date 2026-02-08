const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pan Baker (OccA 122)', () => {
  test('gives 2 clay and 1 wood when using sow-bake', () => {
    const card = res.getCardById('pan-baker-a122')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.wood = 0

    card.onAction(game, dennis, 'sow-bake')

    expect(dennis.clay).toBe(2)
    expect(dennis.wood).toBe(1)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('pan-baker-a122')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.wood = 0

    card.onAction(game, dennis, 'plow-sow')

    expect(dennis.clay).toBe(0)
    expect(dennis.wood).toBe(0)
  })
})
