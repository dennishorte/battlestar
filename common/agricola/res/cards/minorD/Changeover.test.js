const res = require('../../index.js')

describe('Changeover (D071)', () => {
  test('has changeover effect properties', () => {
    const card = res.getCardById('changeover-d071')
    expect(card.allowsAnytimeExchange).toBe(true)
    expect(card.changeoverEffect).toBe(true)
  })

  test('has correct properties', () => {
    const card = res.getCardById('changeover-d071')
    expect(card.cost).toEqual({})
  })
})
