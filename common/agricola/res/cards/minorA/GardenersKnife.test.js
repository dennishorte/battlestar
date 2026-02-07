const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Gardener's Knife (A007)", () => {
  test('gives food for grain fields and grain for vegetable fields', () => {
    const card = res.getCardById('gardeners-knife-a007')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.grain = 0
    dennis.getGrainFieldCount = () => 2
    dennis.getVegetableFieldCount = () => 3

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(2)
    expect(dennis.grain).toBe(3)
  })

  test('gives nothing when no fields', () => {
    const card = res.getCardById('gardeners-knife-a007')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.grain = 0
    dennis.getGrainFieldCount = () => 0
    dennis.getVegetableFieldCount = () => 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(0)
    expect(dennis.grain).toBe(0)
  })
})
