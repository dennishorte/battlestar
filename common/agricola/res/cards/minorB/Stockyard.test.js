const res = require('../../index.js')

describe('Stockyard (B012)', () => {
  test('holds up to 3 animals of same type', () => {
    const card = res.getCardById('stockyard-b012')
    expect(card.holdsAnimals).toBe(3)
    expect(card.sameTypeOnly).toBe(true)
    expect(card.vps).toBe(1)
  })
})
