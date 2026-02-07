const res = require('../../index.js')

describe('Iron Oven (E063)', () => {
  test('has baking rate of 6', () => {
    const card = res.getCardById('iron-oven-e063')
    expect(card.bakingRate).toBe(6)
    expect(card.maxBakePerAction).toBe(1)
    expect(card.vps).toBe(2)
  })
})
