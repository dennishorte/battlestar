const card = require('./conflict-battle-for-carthag.js')

describe('conflict-battle-for-carthag', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-battle-for-carthag')
    expect(card.name).toBe('Battle for Carthag')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(3)
  })
})
