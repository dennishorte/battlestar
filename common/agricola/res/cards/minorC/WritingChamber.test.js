const res = require('../../index.js')

describe('Writing Chamber (C031)', () => {
  test('gives bonus points equal to negative points', () => {
    const card = res.getCardById('writing-chamber-c031')
    const mockPlayer = {
      calculateNegativePoints: () => -5,
    }
    expect(card.getEndGamePoints(mockPlayer)).toBe(5)
  })

  test('caps at 7 bonus points', () => {
    const card = res.getCardById('writing-chamber-c031')
    const mockPlayer = {
      calculateNegativePoints: () => -10,
    }
    expect(card.getEndGamePoints(mockPlayer)).toBe(7)
  })
})
