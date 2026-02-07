const res = require('../../index.js')

describe('Pottery Yard (B031)', () => {
  test('gives 2 bonus points for adjacent unused spaces', () => {
    const card = res.getCardById('pottery-yard-b031')
    const mockPlayer = {
      hasAdjacentUnusedSpaces: (count) => count <= 2,
    }
    expect(card.getEndGamePoints(mockPlayer)).toBe(2)
  })

  test('gives 0 points without adjacent unused spaces', () => {
    const card = res.getCardById('pottery-yard-b031')
    const mockPlayer = {
      hasAdjacentUnusedSpaces: () => false,
    }
    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })
})
