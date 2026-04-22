const card = require('./arakeen-1.js')

describe('Arakeen (contract) [arakeen-1]', () => {
  test('data', () => {
    expect(card.id).toBe('arakeen-1')
    expect(card.name).toBe('Arakeen')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
