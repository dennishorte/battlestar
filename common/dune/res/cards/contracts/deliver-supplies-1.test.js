const card = require('./deliver-supplies-1.js')

describe('Deliver Supplies (contract) [deliver-supplies-1]', () => {
  test('data', () => {
    expect(card.id).toBe('deliver-supplies-1')
    expect(card.name).toBe('Deliver Supplies')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
