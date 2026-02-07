const res = require('../../index.js')

describe('Hardware Store (C082)', () => {
  test('has onAction for day-laborer', () => {
    const card = res.getCardById('hardware-store-c082')
    expect(card.onAction).toBeDefined()
    expect(card.vps).toBe(1)
  })
})
