const card = require('./dreadnought.js')

describe('Dreadnought (contract)', () => {
  test('data', () => {
    expect(card.id).toBe('dreadnought')
    expect(card.name).toBe('Dreadnought')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
