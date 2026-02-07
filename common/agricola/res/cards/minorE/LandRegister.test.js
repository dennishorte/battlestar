const res = require('../../index.js')

describe('Land Register (E034)', () => {
  test('gives 2 bonus points if no unused spaces', () => {
    const card = res.getCardById('land-register-e034')

    const noUnused = { getUnusedSpaces: () => 0 }
    expect(card.getEndGamePoints(noUnused)).toBe(2)

    const hasUnused = { getUnusedSpaces: () => 3 }
    expect(card.getEndGamePoints(hasUnused)).toBe(0)
  })
})
