const res = require('../../index.js')

describe('Fellow Grazer (OccA 099)', () => {
  test('gives 2 points per large pasture', () => {
    const card = res.getCardById('fellow-grazer-a099')
    const mockPlayer = { getPasturesWithMinSpaces: (min) => min === 3 ? 2 : 0 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(4)
  })

  test('gives 0 points with no large pastures', () => {
    const card = res.getCardById('fellow-grazer-a099')
    const mockPlayer = { getPasturesWithMinSpaces: (_min) => 0 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })

  test('gives 6 points for 3 large pastures', () => {
    const card = res.getCardById('fellow-grazer-a099')
    const mockPlayer = { getPasturesWithMinSpaces: (min) => min === 3 ? 3 : 0 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(6)
  })
})
