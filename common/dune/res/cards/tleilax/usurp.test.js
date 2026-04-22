const card = require('./usurp.js')

describe('Usurp', () => {
  test('data', () => {
    expect(card.id).toBe('usurp')
    expect(card.name).toBe('Usurp')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
