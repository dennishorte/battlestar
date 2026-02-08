const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Furnisher (OccD 096)', () => {
  test('gives 2 wood on play', () => {
    const card = res.getCardById('furnisher-d096')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('sets furnisher discount flag after building room', () => {
    const card = res.getCardById('furnisher-d096')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.furnisherDiscount = false

    card.onBuildRoom(game, dennis)

    expect(dennis.furnisherDiscount).toBe(true)
  })

  test('reduces wood cost by 1 when discount is active', () => {
    const card = res.getCardById('furnisher-d096')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.furnisherDiscount = true
    const cost = { wood: 3, clay: 2 }

    const modifiedCost = card.modifyImprovementCost(dennis, cost)

    expect(modifiedCost.wood).toBe(2)
    expect(modifiedCost.clay).toBe(2)
    expect(dennis.furnisherDiscount).toBe(false)
  })

  test('does not modify cost when discount is not active', () => {
    const card = res.getCardById('furnisher-d096')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.furnisherDiscount = false
    const cost = { wood: 3, clay: 2 }

    const modifiedCost = card.modifyImprovementCost(dennis, cost)

    expect(modifiedCost.wood).toBe(3)
    expect(modifiedCost.clay).toBe(2)
  })

  test('does not modify cost when no wood in cost', () => {
    const card = res.getCardById('furnisher-d096')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.furnisherDiscount = true
    const cost = { clay: 2, reed: 1 }

    const modifiedCost = card.modifyImprovementCost(dennis, cost)

    expect(modifiedCost).toEqual(cost)
    expect(dennis.furnisherDiscount).toBe(true) // Not consumed
  })
})
