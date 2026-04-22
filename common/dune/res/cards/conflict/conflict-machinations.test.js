const card = require('./conflict-machinations.js')

describe('conflict-machinations', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-machinations')
    expect(card.name).toBe('Machinations')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
