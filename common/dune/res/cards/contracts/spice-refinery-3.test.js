const card = require('./spice-refinery-3.js')

describe('Spice Refinery (contract) [spice-refinery-3]', () => {
  test('data', () => {
    expect(card.id).toBe('spice-refinery-3')
    expect(card.name).toBe('Spice Refinery')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
  })
})
