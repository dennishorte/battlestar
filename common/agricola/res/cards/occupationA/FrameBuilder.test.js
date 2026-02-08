const res = require('../../index.js')

describe('Frame Builder (OccA 123)', () => {
  test('modifies build cost to allow wood substitution', () => {
    const card = res.getCardById('frame-builder-a123')
    const mockPlayer = {}
    const cost = { clay: 5, reed: 2 }

    const modifiedCost = card.modifyBuildCost(mockPlayer, cost, 2)

    expect(modifiedCost.clay).toBe(5)
    expect(modifiedCost.reed).toBe(2)
    expect(modifiedCost.allowWoodSubstitution).toBe(2)
  })

  test('substitution count equals number of rooms', () => {
    const card = res.getCardById('frame-builder-a123')
    const mockPlayer = {}
    const cost = { stone: 3, reed: 1 }

    const modifiedCost = card.modifyBuildCost(mockPlayer, cost, 3)

    expect(modifiedCost.allowWoodSubstitution).toBe(3)
  })

  test('preserves original cost properties', () => {
    const card = res.getCardById('frame-builder-a123')
    const mockPlayer = {}
    const cost = { stone: 4, reed: 2, food: 1 }

    const modifiedCost = card.modifyBuildCost(mockPlayer, cost, 1)

    expect(modifiedCost.stone).toBe(4)
    expect(modifiedCost.reed).toBe(2)
    expect(modifiedCost.food).toBe(1)
    expect(modifiedCost.allowWoodSubstitution).toBe(1)
  })
})
