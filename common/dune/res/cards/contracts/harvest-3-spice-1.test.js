const card = require('./harvest-3-spice-1.js')

describe('Harvest 3+ Spice (contract) [harvest-3-spice-1]', () => {
  test('data', () => {
    expect(card.id).toBe('harvest-3-spice-1')
    expect(card.name).toBe('Harvest 3+ Spice')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
