const res = require('../../index.js')

describe("Potter's Market (B069)", () => {
  test('allows anytime purchase', () => {
    const card = res.getCardById('potters-market-b069')
    expect(card.allowsAnytimePurchase).toBe(true)
  })

  test('has pottersMarketPurchase flag', () => {
    const card = res.getCardById('potters-market-b069')
    expect(card.pottersMarketPurchase).toBe(true)
  })

  test('has 1 VP', () => {
    const card = res.getCardById('potters-market-b069')
    expect(card.vps).toBe(1)
  })

  test('costs 2 wood', () => {
    const card = res.getCardById('potters-market-b069')
    expect(card.cost).toEqual({ wood: 2 })
  })
})
