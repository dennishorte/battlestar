const card = require('./twisted-mentat.js')

describe('Twisted Mentat', () => {
  test('data', () => {
    expect(card.id).toBe('twisted-mentat')
    expect(card.name).toBe('Twisted Mentat')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
