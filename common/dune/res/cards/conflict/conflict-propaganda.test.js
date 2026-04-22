const card = require('./conflict-propaganda.js')

describe('conflict-propaganda', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-propaganda')
    expect(card.name).toBe('Propaganda')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(3)
  })
})
