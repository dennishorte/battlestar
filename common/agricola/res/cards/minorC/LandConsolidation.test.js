const res = require('../../index.js')

describe('Land Consolidation (C069)', () => {
  test('has allowsAnytimeExchange flag', () => {
    const card = res.getCardById('land-consolidation-c069')
    expect(card.allowsAnytimeExchange).toBe(true)
  })

  test('has landConsolidationEffect flag', () => {
    const card = res.getCardById('land-consolidation-c069')
    expect(card.landConsolidationEffect).toBe(true)
  })

  test('has no cost', () => {
    const card = res.getCardById('land-consolidation-c069')
    expect(card.cost).toEqual({})
  })
})
