const res = require('../../index.js')

describe('Misanthropy (E035)', () => {
  test('gives bonus points based on family size', () => {
    const card = res.getCardById('misanthropy-e035')

    const mockPlayer4 = { getFamilySize: () => 4 }
    expect(card.getEndGamePoints(mockPlayer4)).toBe(2)

    const mockPlayer3 = { getFamilySize: () => 3 }
    expect(card.getEndGamePoints(mockPlayer3)).toBe(3)

    const mockPlayer2 = { getFamilySize: () => 2 }
    expect(card.getEndGamePoints(mockPlayer2)).toBe(5)

    const mockPlayer5 = { getFamilySize: () => 5 }
    expect(card.getEndGamePoints(mockPlayer5)).toBe(0)
  })
})
