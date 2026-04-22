const card = require('./conflict-battle-for-arrakeen.js')

describe('conflict-battle-for-arrakeen', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-battle-for-arrakeen')
    expect(card.name).toBe('Battle for Arrakeen')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(3)
  })
})
