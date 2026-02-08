const res = require('../../index.js')

describe('Storeroom (D031)', () => {
  test('gives points for grain/vegetable pairs', () => {
    const card = res.getCardById('storeroom-d031')
    const player = {
      grain: 3,
      vegetables: 3,
      getGrainInFields: () => 2,
      getVegetablesInFields: () => 2,
    }

    // Total grain: 5, total vegetables: 5
    // Pairs: 5, rounded up: ceil(5/2) = 3
    expect(card.getEndGamePoints(player)).toBe(3)
  })

  test('limits pairs by smaller crop count', () => {
    const card = res.getCardById('storeroom-d031')
    const player = {
      grain: 10,
      vegetables: 1,
      getGrainInFields: () => 0,
      getVegetablesInFields: () => 1,
    }

    // Total grain: 10, total vegetables: 2
    // Pairs: 2, rounded up: ceil(2/2) = 1
    expect(card.getEndGamePoints(player)).toBe(1)
  })

  test('rounds up partial pairs', () => {
    const card = res.getCardById('storeroom-d031')
    const player = {
      grain: 1,
      vegetables: 1,
      getGrainInFields: () => 0,
      getVegetablesInFields: () => 0,
    }

    // Total grain: 1, total vegetables: 1
    // Pairs: 1, rounded up: ceil(1/2) = 1
    expect(card.getEndGamePoints(player)).toBe(1)
  })

  test('gives 0 points for no pairs', () => {
    const card = res.getCardById('storeroom-d031')
    const player = {
      grain: 0,
      vegetables: 0,
      getGrainInFields: () => 0,
      getVegetablesInFields: () => 0,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('storeroom-d031')
    expect(card.cost).toEqual({ wood: 1, stone: 2 })
    expect(card.vps).toBe(1)
  })
})
