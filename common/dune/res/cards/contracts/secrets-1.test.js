const card = require('./secrets-1.js')

describe('Secrets (contract) [secrets-1]', () => {
  test('data', () => {
    expect(card.id).toBe('secrets-1')
    expect(card.name).toBe('Secrets')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
