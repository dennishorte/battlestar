const res = require('../../index.js')

describe('Early Cattle (C083)', () => {
  test('gives 2 cattle and has -3 VPs', () => {
    const card = res.getCardById('early-cattle-c083')
    expect(card.onPlay).toBeDefined()
    expect(card.vps).toBe(-3)
  })
})
