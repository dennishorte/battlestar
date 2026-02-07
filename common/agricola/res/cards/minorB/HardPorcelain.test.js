const res = require('../../index.js')

describe('Hard Porcelain (B080)', () => {
  test('allows anytime exchange', () => {
    const card = res.getCardById('hard-porcelain-b080')
    expect(card.allowsAnytimeExchange).toBe(true)
  })

  test('has exchange rates', () => {
    const card = res.getCardById('hard-porcelain-b080')
    expect(card.exchangeRates).toEqual({ clay: 2, stone: 1 })
  })

  test('costs 1 clay', () => {
    const card = res.getCardById('hard-porcelain-b080')
    expect(card.cost).toEqual({ clay: 1 })
  })
})
