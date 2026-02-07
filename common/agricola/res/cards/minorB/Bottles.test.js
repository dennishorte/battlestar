const res = require('../../index.js')

describe('Bottles (B036)', () => {
  test('has special cost based on family members', () => {
    const card = res.getCardById('bottles-b036')
    const mockPlayer = { familyMembers: 3 }
    const cost = card.getSpecialCost(mockPlayer)
    expect(cost).toEqual({ clay: 3, food: 3 })
  })

  test('gives 4 VPs', () => {
    const card = res.getCardById('bottles-b036')
    expect(card.vps).toBe(4)
  })
})
