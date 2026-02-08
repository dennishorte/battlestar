const res = require('../../index.js')

describe('Tea House (D053)', () => {
  test('has allowsSkipSecondPerson property', () => {
    const card = res.getCardById('tea-house-d053')
    expect(card.allowsSkipSecondPerson).toBe(true)
  })

  test('has correct properties', () => {
    const card = res.getCardById('tea-house-d053')
    expect(card.cost).toEqual({ wood: 1, stone: 1 })
    expect(card.vps).toBe(2)
    expect(card.prereqs).toEqual({ minRound: 6 })
  })
})
