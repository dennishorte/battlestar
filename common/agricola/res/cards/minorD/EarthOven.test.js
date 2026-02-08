const res = require('../../index.js')

describe('Earth Oven (D059)', () => {
  test('has anytime conversions for animals and vegetables', () => {
    const card = res.getCardById('earth-oven-d059')
    expect(card.anytimeConversions).toEqual([
      { from: 'vegetables', to: 'food', rate: 3 },
      { from: 'sheep', to: 'food', rate: 2 },
      { from: 'boar', to: 'food', rate: 3 },
      { from: 'cattle', to: 'food', rate: 3 },
    ])
  })

  test('has baking conversion', () => {
    const card = res.getCardById('earth-oven-d059')
    expect(card.bakingConversion).toEqual({ from: 'grain', to: 'food', rate: 2 })
  })

  test('has correct properties', () => {
    const card = res.getCardById('earth-oven-d059')
    expect(card.cost).toEqual({})
    expect(card.vps).toBe(3)
    expect(card.prereqs).toEqual({ returnMajor: ['fireplace-2', 'fireplace-3'] })
    expect(card.countsAsMajorOrMinor).toBe(true)
  })
})
