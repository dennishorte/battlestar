const res = require('../../index.js')

describe('Pellet Press (D046)', () => {
  test('has pellet press effect properties', () => {
    const card = res.getCardById('pellet-press-d046')
    expect(card.allowsAnytimePurchase).toBe(true)
    expect(card.pelletPressEffect).toBe(true)
  })

  test('has correct properties', () => {
    const card = res.getCardById('pellet-press-d046')
    expect(card.cost).toEqual({ clay: 2 })
    expect(card.prereqs).toEqual({ occupations: 2 })
  })
})
