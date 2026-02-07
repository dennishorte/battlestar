const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Feedyard (B011)', () => {
  test('gives food for unused spots after breeding', () => {
    const card = res.getCardById('feedyard-b011')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getPastureCount = jest.fn().mockReturnValue(3)
    dennis.feedyardAnimals = 1

    card.onBreedingPhaseEnd(game, dennis)

    expect(dennis.food).toBe(2) // 3 capacity - 1 used = 2 food
  })

  test('gives no food when fully used', () => {
    const card = res.getCardById('feedyard-b011')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getPastureCount = jest.fn().mockReturnValue(3)
    dennis.feedyardAnimals = 3

    card.onBreedingPhaseEnd(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('has holdsAnimalsPerPasture flag', () => {
    const card = res.getCardById('feedyard-b011')
    expect(card.holdsAnimalsPerPasture).toBe(true)
  })

  test('has 1 VP', () => {
    const card = res.getCardById('feedyard-b011')
    expect(card.vps).toBe(1)
  })

  test('costs clay and grain', () => {
    const card = res.getCardById('feedyard-b011')
    expect(card.cost).toEqual({ clay: 1, grain: 1 })
  })
})
