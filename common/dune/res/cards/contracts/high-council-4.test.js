const card = require('./high-council-4.js')

describe('High Council (contract) [high-council-4]', () => {
  test('data', () => {
    expect(card.id).toBe('high-council-4')
    expect(card.name).toBe('High Council')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
  })
})
