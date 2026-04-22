const card = require('./conflict-secure-imperial-basin.js')

describe('conflict-secure-imperial-basin', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-secure-imperial-basin')
    expect(card.name).toBe('Secure Imperial Basin')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
