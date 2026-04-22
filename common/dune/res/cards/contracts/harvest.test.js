const card = require('./harvest.js')

describe('Harvest (contract)', () => {
  test('data', () => {
    expect(card.id).toBe('harvest')
    expect(card.name).toBe('Harvest')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
  })
})
