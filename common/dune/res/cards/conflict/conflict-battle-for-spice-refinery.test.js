const card = require('./conflict-battle-for-spice-refinery.js')

describe('conflict-battle-for-spice-refinery', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-battle-for-spice-refinery')
    expect(card.name).toBe('Battle for Spice Refinery')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(3)
  })
})
