const res = require('../../index.js')

describe('Hunting Trophy (D082)', () => {
  test('modifies house redevelopment cost with building resource discount', () => {
    const card = res.getCardById('hunting-trophy-d082')
    const cost = { stone: 2, clay: 1 }

    const newCost = card.modifyHouseRedevelopmentCost(cost)

    expect(newCost.buildingResourceDiscount).toBe(1)
    expect(newCost.stone).toBe(2)
    expect(newCost.clay).toBe(1)
  })

  test('modifies farm redevelopment fence cost by reducing 3 wood', () => {
    const card = res.getCardById('hunting-trophy-d082')
    const cost = { wood: 10 }

    const newCost = card.modifyFarmRedevelopmentFenceCost(cost)

    expect(newCost.wood).toBe(7)
  })

  test('does not reduce wood below 0', () => {
    const card = res.getCardById('hunting-trophy-d082')
    const cost = { wood: 2 }

    const newCost = card.modifyFarmRedevelopmentFenceCost(cost)

    expect(newCost.wood).toBe(0)
  })

  test('handles cost with no wood', () => {
    const card = res.getCardById('hunting-trophy-d082')
    const cost = { stone: 2 }

    const newCost = card.modifyFarmRedevelopmentFenceCost(cost)

    expect(newCost.stone).toBe(2)
    expect(newCost.wood).toBeUndefined()
  })

  test('has correct properties', () => {
    const card = res.getCardById('hunting-trophy-d082')
    expect(card.cost).toEqual({ boar: 1 })
    expect(card.costAlternative).toEqual({ cookBoar: true })
    expect(card.vps).toBe(1)
  })
})
