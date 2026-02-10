const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Garden Hoe', () => {
  test('gives 1 clay and 1 stone on unconditional sow', () => {
    const card = res.getCardById('garden-hoe-a079')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['garden-hoe-a079'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onSowVegetables(game, dennis, true)

    expect(dennis.clay).toBe(1)
    expect(dennis.stone).toBe(1)
  })

  test('does not trigger on conditional sow', () => {
    const card = res.getCardById('garden-hoe-a079')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['garden-hoe-a079'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    card.onSowVegetables(game, dennis, false)

    expect(dennis.clay).toBe(0)
    expect(dennis.stone).toBe(0)
  })
})
