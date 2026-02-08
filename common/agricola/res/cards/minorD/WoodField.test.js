const res = require('../../index.js')

describe('Wood Field (D075)', () => {
  test('has wood field properties', () => {
    const card = res.getCardById('wood-field-d075')
    expect(card.providesWoodField).toBe(true)
    expect(card.fieldCapacity).toBe(2)
  })

  test('has correct properties', () => {
    const card = res.getCardById('wood-field-d075')
    expect(card.cost).toEqual({ food: 1 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ occupations: 1 })
  })
})
