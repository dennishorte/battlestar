const card = require('./spice-refinery-1.js')

describe('Spice Refinery (contract) [spice-refinery-1]', () => {
  test('data', () => {
    expect(card.id).toBe('spice-refinery-1')
    expect(card.name).toBe('Spice Refinery')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
