const card = require('./conflict-sort-through-the-chaos.js')

describe('conflict-sort-through-the-chaos', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-sort-through-the-chaos')
    expect(card.name).toBe('Sort Through the Chaos')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
