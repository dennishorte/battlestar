const res = require('../../index.js')

describe('Large Pottery (D060)', () => {
  test('has anytime conversion for clay to food', () => {
    const card = res.getCardById('large-pottery-d060')
    expect(card.anytimeConversions).toEqual([
      { from: 'clay', to: 'food', rate: 2 },
    ])
  })

  test('gives 0 points for less than 3 clay', () => {
    const card = res.getCardById('large-pottery-d060')
    expect(card.getEndGamePoints({ clay: 2 })).toBe(0)
  })

  test('gives 1 point for 3 clay', () => {
    const card = res.getCardById('large-pottery-d060')
    expect(card.getEndGamePoints({ clay: 3 })).toBe(1)
  })

  test('gives 1 point for 4 clay', () => {
    const card = res.getCardById('large-pottery-d060')
    expect(card.getEndGamePoints({ clay: 4 })).toBe(1)
  })

  test('gives 2 points for 5 clay', () => {
    const card = res.getCardById('large-pottery-d060')
    expect(card.getEndGamePoints({ clay: 5 })).toBe(2)
  })

  test('gives 3 points for 6 clay', () => {
    const card = res.getCardById('large-pottery-d060')
    expect(card.getEndGamePoints({ clay: 6 })).toBe(3)
  })

  test('gives 4 points for 7+ clay', () => {
    const card = res.getCardById('large-pottery-d060')
    expect(card.getEndGamePoints({ clay: 7 })).toBe(4)
    expect(card.getEndGamePoints({ clay: 10 })).toBe(4)
  })

  test('has correct properties', () => {
    const card = res.getCardById('large-pottery-d060')
    expect(card.cost).toEqual({ clay: 1, stone: 1 })
    expect(card.vps).toBe(3)
    expect(card.prereqs).toEqual({ returnMajor: ['pottery'] })
  })
})
