const res = require('../../index.js')

describe('Braggart (OccA 133)', () => {
  test('gives 9 points for 10+ improvements', () => {
    const card = res.getCardById('braggart-a133')
    const mockPlayer = { getImprovementCount: () => 10 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(9)
  })

  test('gives 9 points for 11 improvements', () => {
    const card = res.getCardById('braggart-a133')
    const mockPlayer = { getImprovementCount: () => 11 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(9)
  })

  test('gives 7 points for 9 improvements', () => {
    const card = res.getCardById('braggart-a133')
    const mockPlayer = { getImprovementCount: () => 9 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(7)
  })

  test('gives 5 points for 8 improvements', () => {
    const card = res.getCardById('braggart-a133')
    const mockPlayer = { getImprovementCount: () => 8 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(5)
  })

  test('gives 4 points for 7 improvements', () => {
    const card = res.getCardById('braggart-a133')
    const mockPlayer = { getImprovementCount: () => 7 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(4)
  })

  test('gives 3 points for 6 improvements', () => {
    const card = res.getCardById('braggart-a133')
    const mockPlayer = { getImprovementCount: () => 6 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(3)
  })

  test('gives 2 points for 5 improvements', () => {
    const card = res.getCardById('braggart-a133')
    const mockPlayer = { getImprovementCount: () => 5 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(2)
  })

  test('gives 0 points for 4 improvements', () => {
    const card = res.getCardById('braggart-a133')
    const mockPlayer = { getImprovementCount: () => 4 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })
})
