const card = require('./high-council-2.js')

describe('High Council (contract) [high-council-2]', () => {
  test('data', () => {
    expect(card.id).toBe('high-council-2')
    expect(card.name).toBe('High Council')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
