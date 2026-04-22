const card = require('./arakeen-2.js')

describe('Arakeen (contract) [arakeen-2]', () => {
  test('data', () => {
    expect(card.id).toBe('arakeen-2')
    expect(card.name).toBe('Arakeen')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
