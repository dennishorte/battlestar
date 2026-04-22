const card = require('./ghola.js')

describe('Ghola', () => {
  test('data', () => {
    expect(card.id).toBe('ghola')
    expect(card.name).toBe('Ghola')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
