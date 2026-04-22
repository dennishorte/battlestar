const card = require('./secrets-2.js')

describe('Secrets (contract) [secrets-2]', () => {
  test('data', () => {
    expect(card.id).toBe('secrets-2')
    expect(card.name).toBe('Secrets')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
  })
})
