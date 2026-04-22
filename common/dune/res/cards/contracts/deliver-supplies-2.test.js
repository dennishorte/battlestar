const card = require('./deliver-supplies-2.js')

describe('Deliver Supplies (contract) [deliver-supplies-2]', () => {
  test('data', () => {
    expect(card.id).toBe('deliver-supplies-2')
    expect(card.name).toBe('Deliver Supplies')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
  })
})
