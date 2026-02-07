const res = require('../../index.js')

describe('Sleeping Corner (A026)', () => {
  test('allows using occupied family growth space', () => {
    const card = res.getCardById('sleeping-corner-a026')
    expect(card.allowOccupiedFamilyGrowth).toBe(true)
  })

  test('has correct cost and vps', () => {
    const card = res.getCardById('sleeping-corner-a026')
    expect(card.cost).toEqual({ wood: 1 })
    expect(card.vps).toBe(1)
  })
})
