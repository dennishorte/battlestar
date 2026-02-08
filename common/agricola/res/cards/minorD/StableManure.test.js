const res = require('../../index.js')

describe('Stable Manure (D072)', () => {
  test('triggers extra harvest goods for unfenced stables', () => {
    const card = res.getCardById('stable-manure-d072')
    const harvestExtraGoodsCalled = []
    const game = {
      actions: {
        harvestExtraGoods: (player, cardArg, count) => {
          harvestExtraGoodsCalled.push({ player, card: cardArg, count })
        },
      },
    }
    const player = {
      getUnfencedStableCount: () => 3,
    }

    card.onHarvest(game, player)

    expect(harvestExtraGoodsCalled).toHaveLength(1)
    expect(harvestExtraGoodsCalled[0].count).toBe(3)
  })

  test('does not trigger when no unfenced stables', () => {
    const card = res.getCardById('stable-manure-d072')
    const harvestExtraGoodsCalled = []
    const game = {
      actions: {
        harvestExtraGoods: (player, cardArg, count) => {
          harvestExtraGoodsCalled.push({ player, card: cardArg, count })
        },
      },
    }
    const player = {
      getUnfencedStableCount: () => 0,
    }

    card.onHarvest(game, player)

    expect(harvestExtraGoodsCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('stable-manure-d072')
    expect(card.cost).toEqual({})
    expect(card.prereqs).toEqual({ occupationsAtMost: 1 })
  })
})
