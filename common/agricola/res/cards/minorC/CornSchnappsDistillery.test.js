const res = require('../../index.js')

describe('Corn Schnapps Distillery (C064)', () => {
  test('has allowsAnytimePurchase flag', () => {
    const card = res.getCardById('corn-schnapps-distillery-c064')
    expect(card.allowsAnytimePurchase).toBe(true)
  })

  test('has cornSchnappsEffect flag', () => {
    const card = res.getCardById('corn-schnapps-distillery-c064')
    expect(card.cornSchnappsEffect).toBe(true)
  })

  test('has correct cost', () => {
    const card = res.getCardById('corn-schnapps-distillery-c064')
    expect(card.cost.wood).toBe(1)
    expect(card.cost.clay).toBe(2)
  })

  test('provides 1 VP', () => {
    const card = res.getCardById('corn-schnapps-distillery-c064')
    expect(card.vps).toBe(1)
  })
})
