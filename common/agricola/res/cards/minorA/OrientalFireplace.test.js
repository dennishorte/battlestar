const res = require('../../index.js')

describe('Oriental Fireplace (A060)', () => {
  test('has correct conversion rates', () => {
    const card = res.getCardById('oriental-fireplace-a060')
    expect(card.anytimeConversions).toBeDefined()
    expect(card.anytimeConversions).toContainEqual({ from: 'vegetables', to: 'food', rate: 4 })
    expect(card.anytimeConversions).toContainEqual({ from: 'sheep', to: 'food', rate: 3 })
    expect(card.anytimeConversions).toContainEqual({ from: 'cattle', to: 'food', rate: 5 })
    expect(card.bakingConversion).toEqual({ from: 'grain', to: 'food', rate: 2 })
  })

  test('counts as major or minor', () => {
    const card = res.getCardById('oriental-fireplace-a060')
    expect(card.countsAsMajorOrMinor).toBe(true)
  })
})
