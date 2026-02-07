const res = require('../../index.js')

describe('Wildlife Reserve (C011)', () => {
  test('holds 1 of each animal type', () => {
    const card = res.getCardById('wildlife-reserve-c011')
    expect(card.holdsAnimals).toEqual({ sheep: 1, boar: 1, cattle: 1 })
    expect(card.mixedAnimals).toBe(true)
    expect(card.vps).toBe(1)
  })
})
