const card = require('./conflict-spice-freighters.js')

describe('conflict-spice-freighters', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-spice-freighters')
    expect(card.name).toBe('Spice Freighters')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
