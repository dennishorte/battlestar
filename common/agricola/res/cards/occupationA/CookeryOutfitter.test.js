const res = require('../../index.js')

describe('Cookery Outfitter (OccA 101)', () => {
  test('gives points equal to cooking improvement count', () => {
    const card = res.getCardById('cookery-outfitter-a101')
    const mockPlayer = { getCookingImprovementCount: () => 3 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(3)
  })

  test('gives 0 points with no cooking improvements', () => {
    const card = res.getCardById('cookery-outfitter-a101')
    const mockPlayer = { getCookingImprovementCount: () => 0 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })

  test('gives 1 point for 1 cooking improvement', () => {
    const card = res.getCardById('cookery-outfitter-a101')
    const mockPlayer = { getCookingImprovementCount: () => 1 }

    expect(card.getEndGamePoints(mockPlayer)).toBe(1)
  })
})
