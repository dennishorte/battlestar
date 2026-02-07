const res = require('../../index.js')

describe('Simple Oven (E064)', () => {
  test('has baking rate of 3', () => {
    const card = res.getCardById('simple-oven-e064')
    expect(card.bakingRate).toBe(3)
    expect(card.maxBakePerAction).toBe(1)
    expect(card.vps).toBe(1)
  })
})
