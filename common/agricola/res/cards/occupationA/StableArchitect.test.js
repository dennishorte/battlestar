const res = require('../../index.js')

describe('Stable Architect (OccA 098)', () => {
  test('gives points equal to unfenced stable count', () => {
    const card = res.getCardById('stable-architect-a098')
    const mockPlayer = { getUnfencedStableCount: () => 3 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(3)
  })

  test('gives 0 points with no unfenced stables', () => {
    const card = res.getCardById('stable-architect-a098')
    const mockPlayer = { getUnfencedStableCount: () => 0 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })

  test('gives 1 point for 1 unfenced stable', () => {
    const card = res.getCardById('stable-architect-a098')
    const mockPlayer = { getUnfencedStableCount: () => 1 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(1)
  })
})
