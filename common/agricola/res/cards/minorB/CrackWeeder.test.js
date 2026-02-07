const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Crack Weeder (B058)', () => {
  test('gives 1 food on play', () => {
    const card = res.getCardById('crack-weeder-b058')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
  })

  test('gives food when harvesting vegetables', () => {
    const card = res.getCardById('crack-weeder-b058')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onHarvestVegetables(game, dennis, 3)

    expect(dennis.food).toBe(3)
  })

  test('does not give food when harvesting 0 vegetables', () => {
    const card = res.getCardById('crack-weeder-b058')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onHarvestVegetables(game, dennis, 0)

    expect(dennis.food).toBe(0)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('crack-weeder-b058')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
