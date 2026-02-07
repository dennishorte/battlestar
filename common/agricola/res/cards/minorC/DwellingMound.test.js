const res = require('../../index.js')

describe('Dwelling Mound (C037)', () => {
  test('has 3 VPs', () => {
    const card = res.getCardById('dwelling-mound-c037')
    expect(card.vps).toBe(3)
    expect(card.prereqs.maxRound).toBe(3)
  })
})
