const res = require('../../index.js')

describe('Clearing Spade (A071)', () => {
  test('has allowsAnytimeCropMove flag', () => {
    const card = res.getCardById('clearing-spade-a071')
    expect(card.allowsAnytimeCropMove).toBe(true)
  })
})
