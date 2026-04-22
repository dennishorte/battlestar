const card = require('./spice-refinery-2.js')

describe('Spice Refinery (contract) [spice-refinery-2]', () => {
  test('data', () => {
    expect(card.id).toBe('spice-refinery-2')
    expect(card.name).toBe('Spice Refinery')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
