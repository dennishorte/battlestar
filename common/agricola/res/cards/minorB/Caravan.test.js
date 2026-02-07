const res = require('../../index.js')

describe('Caravan (B010)', () => {
  test('provides room for 1 person', () => {
    const card = res.getCardById('caravan-b010')
    expect(card.providesRoom).toBe(true)
    expect(card.cost).toEqual({ wood: 3, food: 3 })
  })
})
