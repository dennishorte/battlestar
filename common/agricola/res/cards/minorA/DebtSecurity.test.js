const res = require('../../index.js')

describe('Debt Security', () => {
  test('gives bonus points = min(major improvements, unused spaces)', () => {
    const card = res.getCardById('debt-security-a031')

    // 3 majors, 5 unused spaces -> 3 points
    const player1 = {
      majorImprovements: ['fireplace-2', 'well', 'pottery'],
      getUnusedFarmyardSpaceCount: () => 5,
    }
    expect(card.getEndGamePoints(player1)).toBe(3)

    // 3 majors, 2 unused spaces -> 2 points
    const player2 = {
      majorImprovements: ['fireplace-2', 'well', 'pottery'],
      getUnusedFarmyardSpaceCount: () => 2,
    }
    expect(card.getEndGamePoints(player2)).toBe(2)
  })
})
