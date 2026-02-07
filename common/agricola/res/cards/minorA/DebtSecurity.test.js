const res = require('../../index.js')

describe('Debt Security (A031)', () => {
  test('gives bonus points based on major improvements and unused spaces', () => {
    const card = res.getCardById('debt-security-a031')
    expect(card.getEndGamePoints).toBeDefined()

    // Create mock player with specific setup
    const mockPlayer = {
      majorImprovements: ['fireplace-2', 'well', 'pottery'],
      getUnusedFarmyardSpaceCount: () => 5,
    }
    // 3 major improvements, 5 unused spaces -> min(3, 5) = 3
    expect(card.getEndGamePoints(mockPlayer)).toBe(3)

    // Test when unused spaces < majors
    mockPlayer.getUnusedFarmyardSpaceCount = () => 2
    expect(card.getEndGamePoints(mockPlayer)).toBe(2)
  })
})
