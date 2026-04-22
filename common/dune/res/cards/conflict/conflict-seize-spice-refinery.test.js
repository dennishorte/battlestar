const card = require('./conflict-seize-spice-refinery.js')

describe('conflict-seize-spice-refinery', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-seize-spice-refinery')
    expect(card.name).toBe('Seize Spice Refinery')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
