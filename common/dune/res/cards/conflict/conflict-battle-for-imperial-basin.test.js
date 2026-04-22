const card = require('./conflict-battle-for-imperial-basin.js')

describe('conflict-battle-for-imperial-basin', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-battle-for-imperial-basin')
    expect(card.name).toBe('Battle for Imperial Basin')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(3)
  })
})
