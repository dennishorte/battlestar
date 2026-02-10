const res = require('../../index.js')

describe('Bassinet', () => {
  test('has allowsBassinetPlacement flag', () => {
    const card = res.getCardById('bassinet-a025')
    expect(card.allowsBassinetPlacement).toBe(true)
  })

  test('has correct cost', () => {
    const card = res.getCardById('bassinet-a025')
    expect(card.cost).toEqual({ wood: 1, reed: 1 })
  })
})
