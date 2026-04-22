const card = require('./conflict-guild-bank-raid.js')

describe('conflict-guild-bank-raid', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-guild-bank-raid')
    expect(card.name).toBe('Guild Bank Raid')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
