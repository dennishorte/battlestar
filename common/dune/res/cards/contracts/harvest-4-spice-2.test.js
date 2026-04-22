const card = require('./harvest-4-spice-2.js')

describe('Harvest 4+ Spice (contract) [harvest-4-spice-2]', () => {
  test('data', () => {
    expect(card.id).toBe('harvest-4-spice-2')
    expect(card.name).toBe('Harvest 4+ Spice')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
