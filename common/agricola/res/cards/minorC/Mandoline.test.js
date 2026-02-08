const res = require('../../index.js')

describe('Mandoline (C046)', () => {
  test('has allowsAnytimePurchase flag', () => {
    const card = res.getCardById('mandoline-c046')
    expect(card.allowsAnytimePurchase).toBe(true)
  })

  test('has mandolineEffect flag', () => {
    const card = res.getCardById('mandoline-c046')
    expect(card.mandolineEffect).toBe(true)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('mandoline-c046')
    expect(card.cost.wood).toBe(1)
  })
})
