const res = require('../../index.js')

describe('Abort Oriel (C032)', () => {
  test('has 3 VPs', () => {
    const card = res.getCardById('abort-oriel-c032')
    expect(card.vps).toBe(3)
  })
})
