const card = require('./high-council-1.js')

describe('High Council (contract) [high-council-1]', () => {
  test('data', () => {
    expect(card.id).toBe('high-council-1')
    expect(card.name).toBe('High Council')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
