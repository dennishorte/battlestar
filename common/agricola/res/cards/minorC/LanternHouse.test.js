const res = require('../../index.js')

describe('Lantern House (C035)', () => {
  test('has 7 VPs and penalty for cards in hand', () => {
    const card = res.getCardById('lantern-house-c035')
    expect(card.vps).toBe(7)
    const mockPlayer = { getHandSize: () => 3 }
    expect(card.getEndGamePoints(mockPlayer)).toBe(-3)
  })
})
