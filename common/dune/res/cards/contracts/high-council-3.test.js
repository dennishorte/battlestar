const card = require('./high-council-3.js')

describe('High Council (contract) [high-council-3]', () => {
  test('data', () => {
    expect(card.id).toBe('high-council-3')
    expect(card.name).toBe('High Council')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
