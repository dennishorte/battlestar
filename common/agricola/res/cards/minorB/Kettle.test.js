const res = require('../../index.js')

describe('Kettle (B032)', () => {
  test('allows anytime exchange', () => {
    const card = res.getCardById('kettle-b032')
    expect(card.allowsAnytimeExchange).toBe(true)
  })

  test('has kettleExchange flag', () => {
    const card = res.getCardById('kettle-b032')
    expect(card.kettleExchange).toBe(true)
  })

  test('requires 1 grain field', () => {
    const card = res.getCardById('kettle-b032')
    expect(card.prereqs.grainFields).toBe(1)
  })

  test('costs 1 clay', () => {
    const card = res.getCardById('kettle-b032')
    expect(card.cost).toEqual({ clay: 1 })
  })
})
